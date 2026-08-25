// ==========================================
// CineFlow Discovery Journey View (Paginated & Multi-Universe)
// ==========================================
import { ApiService } from '../api.js';
import { CONFIG } from '../config.js';
import { VideoModal } from '../components/modal.js';
import { GenreModal } from '../components/genreModal.js';

export function renderDiscoveryView(container, initialGenre = 'all', initialPage = 1) {
  let activeGenre = initialGenre || 'all';
  let currentPage = parseInt(initialPage, 10) || 1;

  container.innerHTML = `
    <div class="v-discovery">
      <!-- Discovery Header -->
      <header class="v-discovery__header">
        <h1 class="v-discovery__title">The Infinite Nebula</h1>
        <p class="v-discovery__subtitle">Navigate the multiverse of cinematic storytelling across cosmic genres powered by OMDb.</p>
      </header>

      <!-- Genre Pills Bar with "More Genres +" -->
      <div class="v-discovery__genre-bar" id="discovery-genre-bar">
        ${CONFIG.PRIMARY_GENRES.map(g => `
          <button class="v-discovery__genre-pill ${g.id === activeGenre ? 'v-discovery__genre-pill--active' : ''}" data-genre="${g.id}">
            <span class="c-icon" style="font-size: 16px; margin-right: 4px;">${g.icon}</span>
            ${g.label}
          </button>
        `).join('')}
        
        <!-- More Genres Modal Trigger -->
        <button class="v-discovery__genre-pill" id="more-genres-btn" style="border-color: rgba(76, 215, 246, 0.4); color: #4cd7f6;">
          <span class="c-icon" style="font-size: 16px; margin-right: 4px;">add_circle</span>
          + More Genres
        </button>
      </div>

      <!-- Nebula Interactive Canvas -->
      <div class="v-discovery__nebula" id="nebula-canvas">
        
        <!-- Orb: Sci-Fi -->
        <div class="v-discovery__orb v-discovery__orb--scifi" data-genre="scifi" data-depth="0.04">
          <div class="v-discovery__orb-content">
            <span class="c-icon v-discovery__orb-icon">rocket_launch</span>
            <h2 class="v-discovery__orb-title">Sci-Fi</h2>
            <p class="v-discovery__orb-count">Space & Quantum</p>
          </div>
          <div class="v-discovery__orb-preview">
            <ul class="v-discovery__orb-list">
              <li style="color: #d0bcff; font-weight: bold; margin-bottom: 4px;">EXPLORE REALMS</li>
              <li>• Deep Space Expeditions</li>
              <li>• Cybernetic Evolution</li>
              <li>• Time & Dimensions</li>
            </ul>
          </div>
        </div>

        <!-- Orb: Cyberpunk -->
        <div class="v-discovery__orb v-discovery__orb--cyber" data-genre="cyber" data-depth="-0.04">
          <div class="v-discovery__orb-content">
            <span class="c-icon v-discovery__orb-icon">memory</span>
            <h2 class="v-discovery__orb-title">Cyberpunk</h2>
            <p class="v-discovery__orb-count">Synthetic Realities</p>
          </div>
          <div class="v-discovery__orb-preview">
            <ul class="v-discovery__orb-list">
              <li style="color: #4cd7f6; font-weight: bold; margin-bottom: 4px;">SYNTH DOMAINS</li>
              <li>• Neural Interfaces</li>
              <li>• High-Tech Metropolises</li>
              <li>• Neon Horizons</li>
            </ul>
          </div>
        </div>

        <!-- Orb: Action / Thriller -->
        <div class="v-discovery__orb v-discovery__orb--action" data-genre="action" data-depth="0.06">
          <div class="v-discovery__orb-content">
            <span class="c-icon v-discovery__orb-icon">local_fire_department</span>
            <h2 class="v-discovery__orb-title">Action & Thriller</h2>
            <p class="v-discovery__orb-count">High Octane</p>
          </div>
          <div class="v-discovery__orb-preview">
            <ul class="v-discovery__orb-list">
              <li style="color: #ff6b6b; font-weight: bold; margin-bottom: 4px;">VELOCITY & ACTION</li>
              <li>• High Speed Pursuits</li>
              <li>• Tactical Operations</li>
              <li>• Adrenaline Thrillers</li>
            </ul>
          </div>
        </div>

        <!-- Orb: Fantasy -->
        <div class="v-discovery__orb v-discovery__orb--fantasy" data-genre="fantasy" data-depth="-0.05">
          <div class="v-discovery__orb-content">
            <span class="c-icon v-discovery__orb-icon">castle</span>
            <h2 class="v-discovery__orb-title">Mythic Fantasy</h2>
            <p class="v-discovery__orb-count">Ancient Epics</p>
          </div>
          <div class="v-discovery__orb-preview">
            <ul class="v-discovery__orb-list">
              <li style="color: #facc15; font-weight: bold; margin-bottom: 4px;">MYTHIC WORLDS</li>
              <li>• Legends & Sorcery</li>
              <li>• Ancient Empires</li>
              <li>• Mythical Quests</li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Discovery Content Container -->
      <div id="discovery-content-area"></div>
    </div>
  `;

  const contentArea = container.querySelector('#discovery-content-area');
  const pills = container.querySelectorAll('.v-discovery__genre-pill');
  const orbs = container.querySelectorAll('.v-discovery__orb');
  const moreGenresBtn = container.querySelector('#more-genres-btn');

  // Render Card Helper
  function renderCard(movie, badgeType = 'tertiary') {
    return `
      <div class="c-movie-card c-movie-card--poster" data-movie-id="${movie.imdbID || movie.id}" style="width: 100%;">
        <div class="c-movie-card__poster-wrapper">
          <img class="c-movie-card__poster" src="${movie.poster}" alt="${movie.title}" onerror="this.style.opacity='0.4'" />
          <div class="c-movie-card__overlay"></div>
          <div class="c-movie-card__play-btn">
            <span class="c-icon c-icon--filled">play_arrow</span>
          </div>
        </div>
        <div class="c-movie-card__content">
          <div class="c-movie-card__meta">
            <span class="c-badge c-badge--${badgeType}">${movie.genre || 'CINEMA'}</span>
            <span class="c-movie-card__info">${movie.year || '2025'}</span>
          </div>
          <h3 class="c-movie-card__title">${movie.title}</h3>
          <div class="c-movie-card__info">
            <span class="c-movie-card__rating">
              <span class="c-icon c-icon--filled">star</span>
              ${movie.rating || '8.8'}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // Render Pagination Bar Helper
  function renderPagination(currentPageNum, totalPages) {
    let pagesHtml = '';
    const maxButtons = 5;
    let start = Math.max(1, currentPageNum - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let p = start; p <= end; p++) {
      pagesHtml += `
        <button class="c-pagination__btn ${p === currentPageNum ? 'c-pagination__btn--active' : ''}" data-page="${p}">
          ${p}
        </button>
      `;
    }

    return `
      <div class="c-pagination">
        <button class="c-pagination__btn c-pagination__btn--nav" id="page-prev-btn" ${currentPageNum === 1 ? 'disabled' : ''}>
          <span class="c-icon">chevron_left</span> Prev
        </button>
        <div class="c-pagination__pages">
          ${pagesHtml}
        </div>
        <button class="c-pagination__btn c-pagination__btn--nav" id="page-next-btn" ${currentPageNum === totalPages ? 'disabled' : ''}>
          Next <span class="c-icon">chevron_right</span>
        </button>
      </div>
    `;
  }

  // Update Universe View with pagination
  async function loadUniverse(genre, page = 1) {
    contentArea.innerHTML = `
      <div style="text-align: center; color: #4cd7f6; padding: 40px;">
        <span class="c-icon" style="font-size: 36px; animation: spin 1s infinite linear;">progress_activity</span>
        <p style="margin-top: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          Loading ${genre.toUpperCase()} (Page ${page}) from OMDb Cloud...
        </p>
      </div>
    `;

    if (genre === 'all') {
      const data = await ApiService.getMoviesByGenreAsync('all');

      contentArea.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 48px;">
          
          <!-- Sci-Fi Universe Section -->
          <section>
            <div class="c-carousel__header" style="margin-bottom: 20px;">
              <h2 class="c-carousel__title">
                <span class="c-icon" style="color: #d0bcff;">rocket_launch</span>
                Sci-Fi & Space Expanse <span style="font-size: 0.8em; color: #9ca3af; font-weight: 400;">(${data.scifi ? data.scifi.length : 0} Titles)</span>
              </h2>
              <button class="c-btn c-btn--glass c-btn--sm genre-shortcut" data-genre="scifi">Explore Sci-Fi Universe →</button>
            </div>
            <div class="v-discovery__grid">
              ${(data.scifi || []).map(m => renderCard(m, 'secondary')).join('')}
            </div>
          </section>

          <!-- Action & Thriller Section -->
          <section>
            <div class="c-carousel__header" style="margin-bottom: 20px;">
              <h2 class="c-carousel__title">
                <span class="c-icon" style="color: #ff6b6b;">local_fire_department</span>
                Action & Thrillers <span style="font-size: 0.8em; color: #9ca3af; font-weight: 400;">(${data.action ? data.action.length : 0} Titles)</span>
              </h2>
              <button class="c-btn c-btn--glass c-btn--sm genre-shortcut" data-genre="action">Explore Action Universe →</button>
            </div>
            <div class="v-discovery__grid">
              ${(data.action || []).map(m => renderCard(m, 'error')).join('')}
            </div>
          </section>

          <!-- Mythic Fantasy Section -->
          <section>
            <div class="c-carousel__header" style="margin-bottom: 20px;">
              <h2 class="c-carousel__title">
                <span class="c-icon" style="color: #facc15;">castle</span>
                Mythic Fantasy <span style="font-size: 0.8em; color: #9ca3af; font-weight: 400;">(${data.fantasy ? data.fantasy.length : 0} Titles)</span>
              </h2>
              <button class="c-btn c-btn--glass c-btn--sm genre-shortcut" data-genre="fantasy">Explore Fantasy Universe →</button>
            </div>
            <div class="v-discovery__grid">
              ${(data.fantasy || []).map(m => renderCard(m, 'glass')).join('')}
            </div>
          </section>

          <!-- Dark & Horror Section -->
          <section>
            <div class="c-carousel__header" style="margin-bottom: 20px;">
              <h2 class="c-carousel__title">
                <span class="c-icon" style="color: #a855f7;">psychology_alt</span>
                Dark & Horror Cinema <span style="font-size: 0.8em; color: #9ca3af; font-weight: 400;">(${data.horror ? data.horror.length : 0} Titles)</span>
              </h2>
              <button class="c-btn c-btn--glass c-btn--sm genre-shortcut" data-genre="horror">Explore Horror Universe →</button>
            </div>
            <div class="v-discovery__grid">
              ${(data.horror || []).map(m => renderCard(m, 'secondary')).join('')}
            </div>
          </section>

        </div>
      `;
    } else {
      // Single Genre Grid with Pagination
      const genreObj = CONFIG.ALL_GENRES.find(g => g.id === genre) || { label: genre.toUpperCase(), icon: 'category' };
      const paginatedResult = await ApiService.fetchGenrePaginated(genre, page);
      const movies = paginatedResult.movies || [];
      const totalPages = paginatedResult.totalPages || 6;

      contentArea.innerHTML = `
        <section id="genre-results-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2 class="c-carousel__title">
                <span class="c-icon" style="color: #4cd7f6;">${genreObj.icon || 'explore'}</span>
                ${genreObj.label} Universe
              </h2>
              <div style="font-size: 13px; color: #8f9195; margin-top: 4px;">
                Showing Page ${page} of ${totalPages} • ${movies.length} titles on this page
              </div>
            </div>
            <button class="c-btn c-btn--glass c-btn--sm genre-shortcut" data-genre="all">← Back to All Universes</button>
          </div>

          <!-- Movies Grid -->
          <div class="v-discovery__grid">
            ${movies.map(m => renderCard(m, 'tertiary')).join('')}
          </div>

          <!-- Pagination Bar -->
          ${renderPagination(page, totalPages)}
        </section>
      `;

      // Bind Pagination Controls
      const prevBtn = contentArea.querySelector('#page-prev-btn');
      const nextBtn = contentArea.querySelector('#page-next-btn');
      
      if (prevBtn && page > 1) {
        prevBtn.addEventListener('click', () => {
          currentPage = page - 1;
          window.location.hash = `#discovery?genre=${genre}&page=${currentPage}`;
          loadUniverse(genre, currentPage);
          contentArea.scrollIntoView({ behavior: 'smooth' });
        });
      }

      if (nextBtn && page < totalPages) {
        nextBtn.addEventListener('click', () => {
          currentPage = page + 1;
          window.location.hash = `#discovery?genre=${genre}&page=${currentPage}`;
          loadUniverse(genre, currentPage);
          contentArea.scrollIntoView({ behavior: 'smooth' });
        });
      }

      contentArea.querySelectorAll('.c-pagination__btn[data-page]').forEach(pageBtn => {
        pageBtn.addEventListener('click', () => {
          const targetP = parseInt(pageBtn.getAttribute('data-page'), 10);
          currentPage = targetP;
          window.location.hash = `#discovery?genre=${genre}&page=${currentPage}`;
          loadUniverse(genre, currentPage);
          contentArea.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    // Bind Shortcut Buttons
    contentArea.querySelectorAll('.genre-shortcut').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetGenre = btn.getAttribute('data-genre');
        selectGenre(targetGenre);
      });
    });

    // Bind Card Clicks
    contentArea.querySelectorAll('.c-movie-card').forEach(card => {
      card.addEventListener('click', async (e) => {
        const imdbId = card.getAttribute('data-movie-id');
        if (e.target.closest('.c-movie-card__play-btn')) {
          const fullMovie = await ApiService.getMovieById(imdbId);
          VideoModal.open(fullMovie);
        } else {
          window.location.hash = `#film/${imdbId}`;
        }
      });
    });
  }

  // Genre selection handler
  function selectGenre(genre, page = 1) {
    activeGenre = genre;
    currentPage = page;
    pills.forEach(p => {
      if (p.getAttribute('data-genre') === genre) {
        p.classList.add('v-discovery__genre-pill--active');
      } else {
        p.classList.remove('v-discovery__genre-pill--active');
      }
    });
    window.location.hash = `#discovery?genre=${genre}&page=${page}`;
    loadUniverse(genre, page);
  }

  // Bind Primary Genre Pills
  pills.forEach(pill => {
    if (pill.id === 'more-genres-btn') return;
    pill.addEventListener('click', () => {
      const genre = pill.getAttribute('data-genre');
      selectGenre(genre, 1);
    });
  });

  // Bind "+ More Genres" Modal Trigger
  if (moreGenresBtn) {
    moreGenresBtn.addEventListener('click', () => {
      GenreModal.open(activeGenre, (selectedGenreId) => {
        selectGenre(selectedGenreId, 1);
      });
    });
  }

  // Bind Nebula Orbs Click
  orbs.forEach(orb => {
    orb.addEventListener('click', () => {
      const genre = orb.getAttribute('data-genre');
      selectGenre(genre, 1);
      contentArea.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 3D Parallax on Mousemove
  const nebula = container.querySelector('#nebula-canvas');
  if (nebula) {
    nebula.addEventListener('mousemove', (e) => {
      const rect = nebula.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      orbs.forEach(orb => {
        const depth = parseFloat(orb.getAttribute('data-depth')) || 0.05;
        orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });

    nebula.addEventListener('mouseleave', () => {
      orbs.forEach(orb => {
        orb.style.transform = '';
      });
    });
  }

  // Initial Load
  loadUniverse(activeGenre, currentPage);
}
