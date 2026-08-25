// ==========================================
// CineFlow Live Search Component
// ==========================================
import { ApiService } from '../api.js';

export class SearchBar {
  constructor(containerEl, onSelectMovie) {
    this.containerEl = containerEl;
    this.onSelectMovie = onSelectMovie;
    this.debounceTimer = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.containerEl.innerHTML = `
      <div class="c-search">
        <div class="c-search__input-wrap">
          <span class="c-icon c-search__icon">search</span>
          <input 
            type="text" 
            class="c-search__input" 
            placeholder="Search cinematic universe..." 
            aria-label="Search movies"
            autocomplete="off"
          />
          <span class="c-icon c-search__clear" title="Clear">close</span>
        </div>
        <div class="c-search__dropdown"></div>
      </div>
    `;

    this.input = this.containerEl.querySelector('.c-search__input');
    this.clearBtn = this.containerEl.querySelector('.c-search__clear');
    this.dropdown = this.containerEl.querySelector('.c-search__dropdown');
  }

  bindEvents() {
    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        this.clearBtn.classList.add('c-search__clear--visible');
      } else {
        this.clearBtn.classList.remove('c-search__clear--visible');
        this.hideDropdown();
        return;
      }

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.performSearch(query), 300);
    });

    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.clearBtn.classList.remove('c-search__clear--visible');
      this.hideDropdown();
      this.input.focus();
    });

    document.addEventListener('click', (e) => {
      if (!this.containerEl.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  async performSearch(query) {
    this.dropdown.innerHTML = `
      <div style="padding: 12px; text-align: center; color: #8f9195; font-size: 13px;">
        <span class="c-icon" style="animation: spin 1s infinite linear; font-size: 16px;">progress_activity</span> Searching...
      </div>
    `;
    this.dropdown.classList.add('c-search__dropdown--open');

    // 1. Search local catalog
    const localResults = typeof ApiService.searchCatalog === 'function' ? ApiService.searchCatalog(query) : [];
    
    // 2. Search OMDb
    const omdbResults = await ApiService.searchOMDb(query);

    // Merge and deduplicate
    const combined = [...localResults];
    omdbResults.forEach(omdbItem => {
      if (!combined.some(c => c.imdbID === omdbItem.imdbID || c.title.toLowerCase() === omdbItem.title.toLowerCase())) {
        combined.push(omdbItem);
      }
    });

    if (combined.length === 0) {
      this.dropdown.innerHTML = `
        <div style="padding: 16px; text-align: center; color: #8f9195; font-size: 13px;">
          No titles found for "${query}". Try another query.
        </div>
      `;
      return;
    }

    this.dropdown.innerHTML = combined.slice(0, 6).map(movie => `
      <div class="c-search__item" data-movie-id="${movie.id}">
        <img class="c-search__item-poster" src="${movie.poster}" alt="${movie.title}" onerror="this.style.opacity='0.3'" />
        <div class="c-search__item-info">
          <div class="c-search__item-title">${movie.title}</div>
          <div class="c-search__item-sub">${movie.year || '2025'} • ${movie.genre || 'Sci-Fi'}</div>
        </div>
      </div>
    `).join('');

    this.dropdown.querySelectorAll('.c-search__item').forEach(item => {
      item.addEventListener('click', () => {
        const movieId = item.getAttribute('data-movie-id');
        this.hideDropdown();
        if (this.onSelectMovie) {
          this.onSelectMovie(movieId);
        }
      });
    });
  }

  hideDropdown() {
    this.dropdown.classList.remove('c-search__dropdown--open');
  }
}
