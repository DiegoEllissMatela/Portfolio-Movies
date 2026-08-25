// ==========================================
// CineFlow Video Player Modal Component (Production)
// ==========================================
import { State } from '../state.js';
import { Toast } from './toast.js';

export class VideoModal {
  static modalEl = null;

  static init() {
    if (this.modalEl) return;

    const modal = document.createElement('div');
    modal.className = 'c-modal';
    modal.id = 'video-player-modal';
    modal.innerHTML = `
      <div class="c-modal__container">
        <button class="c-modal__close" id="modal-close-btn" aria-label="Close modal">
          <span class="c-icon">close</span>
        </button>
        <div class="c-modal__video-wrapper" id="modal-video-box"></div>
        <div class="c-modal__body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 8px;">
            <div>
              <h2 class="c-modal__title" id="modal-movie-title">Movie Title</h2>
              <div id="modal-movie-meta" style="font-size: 12px; color: #4cd7f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;"></div>
            </div>
            <div style="display: flex; gap: 8px;" id="modal-actions-box"></div>
          </div>
          <p class="c-modal__desc" id="modal-movie-desc">Description</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Close actions
    modal.querySelector('#modal-close-btn').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('c-modal--open')) {
        this.close();
      }
    });
  }

  static open(movie) {
    this.init();
    const titleEl = this.modalEl.querySelector('#modal-movie-title');
    const descEl = this.modalEl.querySelector('#modal-movie-desc');
    const metaEl = this.modalEl.querySelector('#modal-movie-meta');
    const actionsBox = this.modalEl.querySelector('#modal-actions-box');
    const videoBox = this.modalEl.querySelector('#modal-video-box');

    titleEl.textContent = movie.title;
    descEl.textContent = movie.synopsis || movie.tagline || '';
    metaEl.textContent = `${movie.genre || 'Cinema'} • ${movie.year || '2025'} • Rating: ${movie.rating || '9.0'}/10`;

    // Dynamic Video Embed URL
    const searchQuery = encodeURIComponent(`${movie.title} ${movie.year || ''} official trailer`);
    const videoUrl = movie.videoUrl || `https://www.youtube-nocookie.com/embed?listType=search&list=${searchQuery}&autoplay=1`;
    const youtubeDirectUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

    // Automatically record to Recently Watched & Log Progress
    State.addToHistory(movie);
    const existingProgress = State.getProgress(movie.id);
    if (existingProgress === 0) {
      State.setProgress(movie.id, 25);
    }

    // Render Actions
    actionsBox.innerHTML = `
      <a href="${youtubeDirectUrl}" target="_blank" rel="noopener noreferrer" class="c-btn c-btn--glass c-btn--sm" title="Watch on YouTube">
        <span class="c-icon" style="font-size: 16px;">open_in_new</span>
        YouTube
      </a>
      <button class="c-btn c-btn--glass c-btn--sm" id="modal-like-btn" title="Like Movie">
        <span class="c-icon" style="font-size: 16px; color: ${State.isLiked(movie.id) ? '#ffb4ab' : 'inherit'};">${State.isLiked(movie.id) ? 'favorite' : 'favorite_border'}</span>
      </button>
      <button class="c-btn c-btn--glass c-btn--sm" id="modal-vault-btn">
        <span class="c-icon" style="font-size: 16px;">${State.isInWatchlist(movie.id) ? 'bookmark_added' : 'bookmark_add'}</span>
        ${State.isInWatchlist(movie.id) ? 'In Vault' : 'Save'}
      </button>
    `;

    // Bind Vault button inside modal
    const vaultBtn = actionsBox.querySelector('#modal-vault-btn');
    if (vaultBtn) {
      vaultBtn.addEventListener('click', () => {
        const added = State.toggleWatchlist(movie);
        vaultBtn.innerHTML = `
          <span class="c-icon" style="font-size: 16px;">${added ? 'bookmark_added' : 'bookmark_add'}</span>
          ${added ? 'In Vault' : 'Save'}
        `;
        Toast.show(
          added ? `Saved "${movie.title}" to Vault` : `Removed "${movie.title}" from Vault`,
          added ? 'success' : 'info'
        );
      });
    }

    // Bind Like button
    const likeBtn = actionsBox.querySelector('#modal-like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        const liked = State.toggleLike(movie);
        likeBtn.innerHTML = `
          <span class="c-icon" style="font-size: 16px; color: ${liked ? '#ffb4ab' : 'inherit'};">${liked ? 'favorite' : 'favorite_border'}</span>
        `;
        Toast.show(
          liked ? `Added "${movie.title}" to Liked Titles` : `Removed from Liked`,
          liked ? 'success' : 'info',
          'favorite'
        );
      });
    }

    videoBox.innerHTML = `
      <iframe 
        src="${videoUrl}" 
        title="${movie.title}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;

    this.modalEl.classList.add('c-modal--open');
    document.body.style.overflow = 'hidden';
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('c-modal--open');
    const videoBox = this.modalEl.querySelector('#modal-video-box');
    if (videoBox) videoBox.innerHTML = '';
    document.body.style.overflow = '';
  }
}
