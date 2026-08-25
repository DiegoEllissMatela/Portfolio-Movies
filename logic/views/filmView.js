// ==========================================
// CineFlow Film Experience View (Production)
// ==========================================
import { ApiService } from '../api.js';
import { State } from '../state.js';
import { VideoModal } from '../components/modal.js';
import { Toast } from '../components/toast.js';
import { CommentaryAudioPlayer } from '../components/audioPlayer.js';

export async function renderFilmView(container, movieId) {
  // Show loading skeleton
  container.innerHTML = `
    <div class="v-film" style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; color: #4cd7f6;">
        <span class="c-icon" style="font-size: 48px; animation: spin 1s infinite linear;">progress_activity</span>
        <p style="margin-top: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Loading Film Experience...</p>
      </div>
    </div>
  `;

  const movie = await ApiService.getMovieById(movieId || 'tt1856101');

  container.innerHTML = `
    <div class="v-film">
      <!-- Backdrop Layer -->
      <div class="v-film__backdrop">
        <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" onerror="this.style.display='none'" />
      </div>

      <!-- Top Back Action -->
      <div style="position: relative; z-index: 10; margin-bottom: 24px;">
        <button class="c-btn c-btn--glass c-btn--sm" id="film-back-btn">
          <span class="c-icon">arrow_back</span>
          Return to Cinema
        </button>
      </div>

      <!-- Content Row -->
      <div class="v-film__content-row">
        <!-- Main Film Details -->
        <div class="v-film__main-info">
          <div class="v-film__meta-badges">
            <span class="c-badge c-badge--tertiary genre-tag" data-genre="${movie.category || 'scifi'}" style="cursor: pointer;" title="Filter by ${movie.genre}">
              ${movie.genre}
            </span>
            <span class="c-badge c-badge--glass">${movie.duration}</span>
            <span class="c-badge c-badge--glass">${movie.year}</span>
            <span class="c-badge c-badge--secondary">
              <span class="c-icon c-icon--filled" style="font-size: 13px; color: #facc15;">star</span>
              ${movie.rating} / 10
            </span>
          </div>

          <h1 class="v-film__title">
            ${movie.title.split(' ')[0]} <span>${movie.title.split(' ').slice(1).join(' ') || ''}</span>
          </h1>

          <p class="v-film__synopsis">${movie.synopsis}</p>

          <div class="v-film__actions">
            <button class="c-btn c-btn--circle-play" id="film-play-circle-btn" title="Begin Sequence">
              <span class="c-icon c-icon--filled">play_arrow</span>
            </button>
            <span style="font-family: 'Plus Jakarta Sans'; font-weight: 700; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: #4cd7f6;">
              Begin Sequence
            </span>

            <button class="c-btn c-btn--glass" id="film-like-btn" title="Like Movie">
              <span class="c-icon" style="color: ${State.isLiked(movie.id) ? '#ffb4ab' : 'inherit'};">${State.isLiked(movie.id) ? 'favorite' : 'favorite_border'}</span>
              ${State.isLiked(movie.id) ? 'Liked' : 'Like'}
            </button>

            <button class="c-btn c-btn--glass" id="film-vault-btn">
              <span class="c-icon">${State.isInWatchlist(movie.id) ? 'bookmark_added' : 'bookmark_add'}</span>
              ${State.isInWatchlist(movie.id) ? 'Saved in Vault' : 'Add to Vault'}
            </button>
            <button class="c-btn c-btn--glass c-btn--icon-only" id="film-share-btn" title="Share Experience">
              <span class="c-icon">share</span>
            </button>
          </div>
        </div>

        <!-- Director's Commentary Floating Panel -->
        <div class="v-film__insight-panel" id="director-insight-box">
          <div class="v-film__insight-header">
            <div class="v-film__insight-avatar">
              <span class="c-icon">mic</span>
            </div>
            <div>
              <div class="v-film__insight-tag">Director's Insight</div>
              <div class="v-film__insight-title">${movie.directorInsight ? movie.directorInsight.track : 'Behind The Lens'}</div>
            </div>
          </div>

          <p style="font-size: 12px; color: #c6c6ca; font-style: italic; line-height: 1.5; margin-bottom: 12px;">
            "${movie.directorInsight ? movie.directorInsight.quote : `Directed by ${movie.director}. Starring ${movie.cast}.`}"
          </p>

          <!-- Audio Waveform Visualizer -->
          <div class="v-film__waveform" id="audio-waveform">
            <div class="v-film__waveform-bar" style="height: 30%;"></div>
            <div class="v-film__waveform-bar" style="height: 60%;"></div>
            <div class="v-film__waveform-bar" style="height: 90%;"></div>
            <div class="v-film__waveform-bar" style="height: 50%;"></div>
            <div class="v-film__waveform-bar" style="height: 80%;"></div>
            <div class="v-film__waveform-bar" style="height: 40%;"></div>
            <div class="v-film__waveform-bar" style="height: 70%;"></div>
            <div class="v-film__waveform-bar" style="height: 45%;"></div>
            <div class="v-film__waveform-bar" style="height: 25%;"></div>
          </div>

          <!-- Audio Controls -->
          <div class="v-film__audio-controls">
            <span id="audio-current-time">02:14</span>
            <button class="v-film__audio-play" id="audio-toggle-btn" title="Play Commentary">
              <span class="c-icon c-icon--filled" id="audio-play-icon">play_circle</span>
            </button>
            <span>${movie.directorInsight ? movie.directorInsight.duration : '12:00'}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Back Button
  const backBtn = container.querySelector('#film-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Bind Genre Tag
  const genreTag = container.querySelector('.genre-tag');
  if (genreTag) {
    genreTag.addEventListener('click', () => {
      const genre = genreTag.getAttribute('data-genre') || 'scifi';
      window.location.hash = `#discovery?genre=${genre}`;
    });
  }

  // Bind Play Video Modal
  const playCircleBtn = container.querySelector('#film-play-circle-btn');
  if (playCircleBtn) {
    playCircleBtn.addEventListener('click', () => {
      VideoModal.open(movie);
    });
  }

  // Bind Vault Button
  const vaultBtn = container.querySelector('#film-vault-btn');
  if (vaultBtn) {
    vaultBtn.addEventListener('click', () => {
      const added = State.toggleWatchlist(movie);
      vaultBtn.innerHTML = `
        <span class="c-icon">${added ? 'bookmark_added' : 'bookmark_add'}</span>
        ${added ? 'Saved in Vault' : 'Add to Vault'}
      `;
      Toast.show(
        added ? `Added "${movie.title}" to your Vault` : `Removed "${movie.title}" from Vault`,
        added ? 'success' : 'info'
      );
    });
  }

  // Bind Like Button
  const likeBtn = container.querySelector('#film-like-btn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const liked = State.toggleLike(movie);
      likeBtn.innerHTML = `
        <span class="c-icon" style="color: ${liked ? '#ffb4ab' : 'inherit'};">${liked ? 'favorite' : 'favorite_border'}</span>
        ${liked ? 'Liked' : 'Like'}
      `;
      Toast.show(
        liked ? `Added "${movie.title}" to Liked Titles` : `Removed from Liked`,
        liked ? 'success' : 'info',
        'favorite'
      );
    });
  }

  // Bind Share Button
  const shareBtn = container.querySelector('#film-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        Toast.show('Cinematic link copied to clipboard!', 'success', 'link');
      } else {
        Toast.show('Link ready to share!', 'info', 'share');
      }
    });
  }

  // Initialize Web Audio Commentary Player
  const insightBox = container.querySelector('#director-insight-box');
  if (insightBox) {
    new CommentaryAudioPlayer(insightBox, {
      durationSeconds: 740,
      onToggle: (isPlaying) => {
        Toast.show(
          isPlaying ? "Streaming Director's Commentary (Ambient Audio FX)" : "Paused Commentary",
          'info',
          'headphones'
        );
      }
    });
  }
}
