// ==========================================
// CineFlow Home View
// ==========================================
import { ApiService } from '../api.js';
import { State } from '../state.js';
import { Toast } from '../components/toast.js';
import { VideoModal } from '../components/modal.js';
import { CarouselDrag } from '../components/carouselDrag.js';

// Static hero — Avengers: Endgame, local image
const HERO_IMDB_ID = 'tt4154796';
const HERO_LOCAL_IMG = './images/AvengersEndGame.webp';

export async function renderHomeView(container) {
  // Loading spinner
  container.innerHTML = `
    <div class="v-home" style="min-height:80vh;display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;color:#4cd7f6;">
        <span class="c-icon" style="font-size:48px;animation:spin 1s infinite linear;">progress_activity</span>
        <p style="margin-top:16px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Loading...</p>
      </div>
    </div>
  `;

  // Fetch shelves + hero details in parallel
  const [heroMovie, trendingMovies, scifiMovies, actionMovies, fantasyMovies] = await Promise.all([
    ApiService.getMovieById(HERO_IMDB_ID).catch(() => null),
    ApiService.fetchTrending(),
    ApiService.fetchCuratedSciFi(),
    ApiService.fetchActionThrillers(),
    ApiService.fetchMythicFantasy(),
  ]);


  // Fallback hero data if API fails
  const hero = heroMovie || {
    id: 'omdb_tt4154796',
    imdbID: 'tt4154796',
    title: 'Avengers: Endgame',
    synopsis: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\'s actions and restore balance to the universe.',
    genre: 'Action',
    year: '2019',
    rating: '8.4',
    badge: '4K Ultra HD',
  };

  const heroWl = State.isInWatchlist(hero.id);

  // ── Movie Card Renderer ──────────────────────────────────────────
  function renderMovieCard(movie, badgeType = 'tertiary') {
    const movieId = movie.imdbID || movie.id || '';
    return `
      <div class="c-movie-card" data-movie-id="${movieId}"
        style="width:100%;border-radius:12px;overflow:hidden;cursor:pointer;background:#0f1923;border:1px solid rgba(255,255,255,0.07);transition:transform 0.3s ease,box-shadow 0.3s ease;"
        onmouseenter="this.style.transform='translateY(-6px) scale(1.03)';this.style.boxShadow='0 16px 40px rgba(0,0,0,0.6),0 0 24px rgba(76,215,246,0.2)';this.querySelector('.card-overlay').style.opacity='0.95';this.querySelector('.card-play').style.opacity='1';this.querySelector('.card-play').style.transform='translate(-50%,-50%) scale(1)';"
        onmouseleave="this.style.transform='';this.style.boxShadow='';this.querySelector('.card-overlay').style.opacity='0.7';this.querySelector('.card-play').style.opacity='0';this.querySelector('.card-play').style.transform='translate(-50%,-50%) scale(0.8)';">
        <div style="position:relative;aspect-ratio:2/3;overflow:hidden;">
          <img src="${movie.poster}" alt="${movie.title}"
            style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;"
            onerror="this.parentElement.style.background='#1a2535';this.style.display='none';" />
          <div class="card-overlay" style="position:absolute;inset:0;background:linear-gradient(to top,rgba(5,7,10,0.95) 0%,rgba(5,7,10,0.3) 50%,transparent 100%);opacity:0.7;transition:opacity 0.3s;"></div>
          <div class="card-play" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.8);width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;color:#fff;opacity:0;transition:all 0.25s ease;">
            <span class="c-icon c-icon--filled" style="font-size:26px;">play_arrow</span>
          </div>
        </div>
        <div style="padding:10px 12px 12px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span class="c-badge c-badge--${badgeType} genre-tag" data-genre="${movie.category||'film'}" style="font-size:10px;">${(movie.genre||'Cinema').split(',')[0].trim()}</span>
            <span style="font-size:11px;color:#6b7280;">${movie.year||''}</span>
          </div>
          <h3 style="font-size:0.88rem;font-weight:700;color:#fff;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${movie.title}">${movie.title}</h3>
          ${movie.rating && movie.rating !== 'N/A' ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;"><span class="c-icon c-icon--filled" style="font-size:13px;color:#facc15;">star</span><span style="font-size:11px;color:#9ca3af;">${movie.rating}</span></div>` : ''}
        </div>
      </div>
    `;
  }

  // ── Page Layout ──────────────────────────────────────────────────
  container.innerHTML = `
    <div class="v-home">

      <!-- ═══ HERO ═══ -->
      <section style="position:relative;width:100%;height:85vh;max-height:850px;min-height:520px;background:#05070a;overflow:hidden;">
        <!-- Background image covers section, anchored to center top so it bleeds edge-to-edge -->
        <img src="${HERO_LOCAL_IMG}" alt="Avengers: Endgame"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;opacity:0.7;" />
        
        <!-- Only bottom edge gradient to blend into page, no darkening over the image itself -->
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 80%,#05070a 100%);pointer-events:none;"></div>

        <!-- Hero Text Content — pinned to bottom-left -->
        <div style="position:absolute;bottom:0;left:0;right:0;z-index:2;padding:0 24px 36px;max-width:640px;text-shadow:0 4px 12px rgba(0,0,0,0.9),0 2px 4px rgba(0,0,0,0.8);">
          <div style="margin-bottom:12px;">
            <span class="c-badge c-badge--tertiary" style="box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <span class="c-badge__dot"></span>
              ${hero.badge || '4K Ultra HD'}
            </span>
          </div>
          <h1 class="v-home__hero-title" style="margin-bottom:16px;">${hero.title}</h1>
          <p class="v-home__hero-desc" style="max-width:520px;margin-bottom:28px;text-shadow:0 4px 12px rgba(0,0,0,0.9),0 2px 4px rgba(0,0,0,0.8);">${(hero.synopsis||'').slice(0,220)}${(hero.synopsis||'').length>220?'…':''}</p>
          <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <button class="c-btn c-btn--primary c-btn--lg" id="hero-watch-btn" style="box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <span class="c-icon c-icon--filled">play_arrow</span>
              Watch Now
            </button>
            <button class="c-btn c-btn--glass c-btn--lg" id="hero-watchlist-btn" style="box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <span class="c-icon">${heroWl ? 'bookmark_added' : 'bookmark_add'}</span>
              ${heroWl ? 'In Vault' : 'Add to Vault'}
            </button>
            <button class="c-btn c-btn--glass c-btn--lg" id="hero-details-btn" style="box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <span class="c-icon">info</span>
              Film Experience
            </button>
          </div>
        </div>
      </section>

      <!-- ═══ SHELVES ═══ -->
      <div style="padding:0 24px;position:relative;z-index:2;">


        <!-- Trending -->
        <div style="margin-bottom:48px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h2 style="font-size:1.3rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px;"><span class="c-icon" style="color:#4cd7f6;">trending_up</span> Trending Now <span style="font-size:0.8rem;font-weight:400;color:#6b7280;">${trendingMovies.length} titles</span></h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;">${trendingMovies.map(m => renderMovieCard(m, 'tertiary')).join('')}</div>
        </div>

        <!-- Sci-Fi -->
        <div style="margin-bottom:48px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h2 style="font-size:1.3rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px;"><span class="c-icon" style="color:#d0bcff;">rocket_launch</span> Sci-Fi & Cyberpunk <span style="font-size:0.8rem;font-weight:400;color:#6b7280;">${scifiMovies.length} titles</span></h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;">${scifiMovies.map(m => renderMovieCard(m, 'secondary')).join('')}</div>
        </div>

        <!-- Action -->
        <div style="margin-bottom:48px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h2 style="font-size:1.3rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px;"><span class="c-icon" style="color:#ff6b6b;">local_fire_department</span> Action & Thrillers <span style="font-size:0.8rem;font-weight:400;color:#6b7280;">${actionMovies.length} titles</span></h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;">${actionMovies.map(m => renderMovieCard(m, 'error')).join('')}</div>
        </div>

        <!-- Fantasy -->
        <div style="margin-bottom:80px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h2 style="font-size:1.3rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px;"><span class="c-icon" style="color:#facc15;">castle</span> Mythic Fantasy <span style="font-size:0.8rem;font-weight:400;color:#6b7280;">${fantasyMovies.length} titles</span></h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;">${fantasyMovies.map(m => renderMovieCard(m, 'glass')).join('')}</div>
        </div>

      </div>
    </div>
  `;

  // ── Hero Buttons ─────────────────────────────────────────────────
  container.querySelector('#hero-watch-btn')?.addEventListener('click', () => VideoModal.open(hero));

  const wlBtn = container.querySelector('#hero-watchlist-btn');
  wlBtn?.addEventListener('click', () => {
    const added = State.toggleWatchlist(hero);
    wlBtn.innerHTML = `<span class="c-icon">${added ? 'bookmark_added' : 'bookmark_add'}</span> ${added ? 'In Vault' : 'Add to Vault'}`;
    Toast.show(added ? `Added "${hero.title}" to your Vault` : `Removed "${hero.title}" from Vault`, added ? 'success' : 'info');
  });

  container.querySelector('#hero-details-btn')?.addEventListener('click', () => {
    window.location.hash = `#film/${hero.imdbID}`;
  });

  // ── Genre Tags ────────────────────────────────────────────────────
  container.querySelectorAll('.genre-tag').forEach(tag => {
    tag.addEventListener('click', e => {
      e.stopPropagation();
      window.location.hash = `#discovery?genre=${tag.getAttribute('data-genre') || 'film'}`;
    });
  });

  // ── Drag-to-Scroll ────────────────────────────────────────────────
  CarouselDrag.initAll(container);

  // ── Movie Card Clicks ─────────────────────────────────────────────
  const allMovies = [...trendingMovies, ...scifiMovies, ...actionMovies, ...fantasyMovies];

  container.querySelectorAll('.c-movie-card[data-movie-id]').forEach(card => {
    card.addEventListener('click', e => {
      const movieId = card.getAttribute('data-movie-id');
      const movie = allMovies.find(m => m.imdbID === movieId || m.id === movieId || `omdb_${m.imdbID}` === movieId);

      if (e.target.closest('.card-play')) {
        if (movie) VideoModal.open(movie);
        return;
      }

      if (movie) {
        window.location.hash = `#film/${movie.imdbID || movieId}`;
      } else if (movieId) {
        window.location.hash = `#film/${movieId.replace('omdb_', '')}`;
      }
    });
  });


}
