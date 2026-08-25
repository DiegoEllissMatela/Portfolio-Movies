// ==========================================
// CineFlow Library / My Vault View (Production)
// ==========================================
import { State } from '../state.js';
import { VideoModal } from '../components/modal.js';
import { Toast } from '../components/toast.js';

export function renderLibraryView(container) {
  let activeTab = 'all'; // 'all', 'watching', 'watchlist', 'history', 'liked'
  let searchQuery = '';
  let sortBy = 'recent'; // 'recent', 'rating', 'year', 'title'

  function getFilteredMovies() {
    let movies = [];
    const continueWatching = State.getContinueWatching();
    const watchlist = State.getWatchlist();
    const history = State.getHistory();
    const liked = State.getLiked();

    if (activeTab === 'watching') {
      movies = [...continueWatching];
    } else if (activeTab === 'watchlist') {
      movies = [...watchlist];
    } else if (activeTab === 'history') {
      movies = [...history];
    } else if (activeTab === 'liked') {
      movies = [...liked];
    } else {
      // Merge all unique
      const map = new Map();
      continueWatching.forEach(m => map.set(m.id, m));
      watchlist.forEach(m => map.set(m.id, m));
      history.forEach(m => map.set(m.id, m));
      liked.forEach(m => map.set(m.id, m));
      movies = Array.from(map.values());
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      movies = movies.filter(m => 
        (m.title && m.title.toLowerCase().includes(q)) || 
        (m.genre && m.genre.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'rating') {
      movies.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (sortBy === 'year') {
      movies.sort((a, b) => parseInt(b.year || 0) - parseInt(a.year || 0));
    } else if (sortBy === 'title') {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    }

    return movies;
  }

  function renderView() {
    const continueWatching = State.getContinueWatching();
    const watchlist = State.getWatchlist();
    const history = State.getHistory();
    const liked = State.getLiked();
    const filteredMovies = getFilteredMovies();

    container.innerHTML = `
      <div class="v-vault">
        <!-- Header -->
        <header class="v-vault__header">
          <div>
            <h1 class="v-vault__title">My Vault</h1>
            <p class="v-vault__subtitle">Your personal encrypted archive of premium cinema, watch history, and bookmarks.</p>
          </div>
          <div class="v-vault__actions">
            <!-- Sort Selector -->
            <select id="vault-sort-select" class="c-search__input" style="padding: 8px 16px; border-radius: 9999px; background: rgba(13, 28, 45, 0.7); width: auto; font-size: 12px; color: #d4e4fa; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
              <option value="recent" ${sortBy === 'recent' ? 'selected' : ''}>Sort: Recently Added</option>
              <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Sort: Highest Rated</option>
              <option value="year" ${sortBy === 'year' ? 'selected' : ''}>Sort: Release Year</option>
              <option value="title" ${sortBy === 'title' ? 'selected' : ''}>Sort: Title A-Z</option>
            </select>

            <!-- Search Input -->
            <div class="c-search" style="max-width: 260px;">
              <div class="c-search__input-wrap">
                <span class="c-icon c-search__icon">search</span>
                <input 
                  type="text" 
                  class="c-search__input" 
                  id="vault-search-input" 
                  placeholder="Search vault..." 
                  value="${searchQuery}"
                />
              </div>
            </div>
          </div>
        </header>

        <!-- Tabs Navigation -->
        <div class="v-vault__tabs" style="margin-bottom: 28px;">
          <button class="v-vault__tab ${activeTab === 'all' ? 'v-vault__tab--active' : ''}" data-tab="all">
            All Archive
          </button>
          <button class="v-vault__tab ${activeTab === 'watching' ? 'v-vault__tab--active' : ''}" data-tab="watching">
            In Progress (${continueWatching.length})
          </button>
          <button class="v-vault__tab ${activeTab === 'watchlist' ? 'v-vault__tab--active' : ''}" data-tab="watchlist">
            Watchlist (${watchlist.length})
          </button>
          <button class="v-vault__tab ${activeTab === 'history' ? 'v-vault__tab--active' : ''}" data-tab="history">
            Recently Watched (${history.length})
          </button>
          <button class="v-vault__tab ${activeTab === 'liked' ? 'v-vault__tab--active' : ''}" data-tab="liked">
            Liked (${liked.length})
          </button>
        </div>

        <!-- History Clear Option if History Tab -->
        ${activeTab === 'history' && history.length > 0 ? `
          <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
            <button id="clear-history-btn" class="c-btn c-btn--glass c-btn--sm" style="color: #ffb4ab; border-color: rgba(255,180,171,0.25);">
              <span class="c-icon" style="font-size: 14px;">delete</span> Clear Watch History
            </button>
          </div>
        ` : ''}

        <!-- Grid or Empty State -->
        ${filteredMovies.length === 0 ? `
          <div class="v-vault__empty">
            <span class="c-icon v-vault__empty-icon">subscriptions</span>
            <h3 class="v-vault__empty-title">Vault is Empty</h3>
            <p>Explore titles in Discovery or Home to bookmark and expand your cinema archive.</p>
            <a href="#discovery" class="c-btn c-btn--primary" style="margin-top: 20px;">
              <span class="c-icon">travel_explore</span>
              Go to Discovery
            </a>
          </div>
        ` : `
          <div class="v-vault__grid">
            ${filteredMovies.map(movie => `
              <div class="c-movie-card c-movie-card--poster ${movie.watchProgress ? 'c-movie-card--progress' : ''}" data-movie-id="${movie.id}" style="width: 100%;">
                <div class="c-movie-card__poster-wrapper">
                  <img class="c-movie-card__poster" src="${movie.poster || movie.backdrop}" alt="${movie.title}" onerror="this.style.opacity='0.4'" />
                  <div class="c-movie-card__overlay"></div>
                  
                  <!-- Play Button -->
                  <div class="c-movie-card__play-btn">
                    <span class="c-icon c-icon--filled">play_arrow</span>
                  </div>

                  <!-- Optional Progress Bar -->
                  ${movie.watchProgress ? `
                    <div class="c-movie-card__progress-bar">
                      <div class="c-movie-card__progress-bar-fill" style="width: ${movie.watchProgress}%;"></div>
                    </div>
                  ` : ''}
                </div>
                <div class="c-movie-card__content">
                  <div class="c-movie-card__meta">
                    <span class="c-badge c-badge--tertiary">${movie.genre}</span>
                    <span class="c-movie-card__info">${movie.watchProgress ? `${movie.watchProgress}%` : (movie.duration || '2h 10m')}</span>
                  </div>
                  <h3 class="c-movie-card__title">${movie.title}</h3>
                  <div class="c-movie-card__info" style="justify-content: space-between;">
                    <span class="c-movie-card__rating">
                      <span class="c-icon c-icon--filled">star</span>
                      ${movie.rating || '9.0'}
                    </span>
                    <span style="font-size: 11px; color: #8f9195;">${movie.year || '2025'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Bind Tab Switching
    container.querySelectorAll('.v-vault__tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.getAttribute('data-tab');
        renderView();
      });
    });

    // Bind Sort Change
    const sortSelect = container.querySelector('#vault-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderView();
      });
    }

    // Bind Search Input
    const searchInput = container.querySelector('#vault-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderView();
        const newSearchInput = container.querySelector('#vault-search-input');
        if (newSearchInput) {
          newSearchInput.focus();
          newSearchInput.selectionStart = newSearchInput.selectionEnd = newSearchInput.value.length;
        }
      });
    }

    // Bind Clear History
    const clearHistoryBtn = container.querySelector('#clear-history-btn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear your entire watch history?')) {
          State.clearHistory();
          Toast.show('Watch history cleared', 'info', 'delete_sweep');
          renderView();
        }
      });
    }

    // Bind Card Clicks
    container.querySelectorAll('.c-movie-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const movieId = card.getAttribute('data-movie-id');
        const movie = getFilteredMovies().find(m => m.id === movieId);
        if (!movie) return;

        if (e.target.closest('.c-movie-card__play-btn')) {
          VideoModal.open(movie);
        } else {
          window.location.hash = `#film/${movie.id}`;
        }
      });
    });
  }

  // Initial render
  renderView();
}
