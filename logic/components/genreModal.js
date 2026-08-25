// ==========================================
// CineFlow Extended Genre Multiverse Modal
// ==========================================
import { CONFIG } from '../config.js';

export class GenreModal {
  static modalEl = null;
  static onSelectCallback = null;

  static init() {
    if (this.modalEl) return;

    const modal = document.createElement('div');
    modal.className = 'c-modal';
    modal.id = 'genre-multiverse-modal';
    modal.innerHTML = `
      <div class="c-modal__container" style="max-width: 780px;">
        <button class="c-modal__close" id="genre-modal-close" aria-label="Close">
          <span class="c-icon">close</span>
        </button>
        <div class="c-modal__body" style="padding: 32px;">
          <div style="margin-bottom: 24px;">
            <h2 class="c-modal__title" style="display: flex; align-items: center; gap: 8px; font-size: 1.4rem;">
              <span class="c-icon" style="color: #4cd7f6;">category</span>
              Multiverse Genre Matrix
            </h2>
            <p class="c-modal__desc">Select any cinema universe or niche dimension to explore.</p>
          </div>
          <div id="genre-grid-box" class="c-genre-grid"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    modal.querySelector('#genre-modal-close').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('c-modal--open')) {
        this.close();
      }
    });
  }

  static open(currentGenre = 'all', onSelect) {
    this.init();
    this.onSelectCallback = onSelect;
    const gridBox = this.modalEl.querySelector('#genre-grid-box');

    gridBox.innerHTML = CONFIG.ALL_GENRES.map(g => `
      <div class="c-genre-card ${g.id === currentGenre ? 'c-genre-card--active' : ''}" data-genre-id="${g.id}">
        <div class="c-genre-card__header">
          <span class="c-icon c-genre-card__icon">${g.icon}</span>
          <h3 class="c-genre-card__title">${g.label}</h3>
        </div>
        <p class="c-genre-card__desc">${g.desc}</p>
      </div>
    `).join('');

    gridBox.querySelectorAll('.c-genre-card').forEach(card => {
      card.addEventListener('click', () => {
        const genreId = card.getAttribute('data-genre-id');
        this.close();
        if (this.onSelectCallback) {
          this.onSelectCallback(genreId);
        } else {
          window.location.hash = `#discovery?genre=${genreId}`;
        }
      });
    });

    this.modalEl.classList.add('c-modal--open');
    document.body.style.overflow = 'hidden';
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('c-modal--open');
    document.body.style.overflow = '';
  }
}
