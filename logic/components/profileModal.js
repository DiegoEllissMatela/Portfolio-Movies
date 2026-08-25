// ==========================================
// CineFlow Archivist Profile & Settings Modal
// ==========================================
import { State } from '../state.js';
import { Toast } from './toast.js';

export class ProfileModal {
  static modalEl = null;

  static init() {
    if (this.modalEl) return;

    const modal = document.createElement('div');
    modal.className = 'c-modal';
    modal.id = 'profile-modal';
    modal.innerHTML = `
      <div class="c-modal__container" style="max-width: 520px;">
        <button class="c-modal__close" id="profile-close-btn" aria-label="Close">
          <span class="c-icon">close</span>
        </button>
        <div class="c-modal__body" style="padding: 32px;">
          <!-- Profile Header -->
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #4cd7f6); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(76, 215, 246, 0.4);">
              <span class="c-icon c-icon--filled" style="font-size: 32px; color: #05070a;">account_circle</span>
            </div>
            <div>
              <h2 class="c-modal__title" style="margin: 0; font-size: 1.3rem;">Chief Archivist</h2>
              <div style="font-size: 12px; color: #4cd7f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;" id="user-rank">Quantum Master</div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px;" id="profile-stats-grid"></div>

          <!-- Preferences & Storage Controls -->
          <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #c6c6ca; margin-bottom: 14px;">
            Archivist Settings
          </h3>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 8px; background: rgba(39, 54, 71, 0.3);">
              <span style="font-size: 13px; color: #d4e4fa;">OMDb Cloud Bridge</span>
              <span class="c-badge c-badge--tertiary">Connected (c4633901)</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 8px; background: rgba(39, 54, 71, 0.3);">
              <span style="font-size: 13px; color: #d4e4fa;">4K Ultra HDR Streaming</span>
              <span class="c-badge c-badge--secondary">Active</span>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="profile-clear-cache" class="c-btn c-btn--glass c-btn--sm" style="color: #ffb4ab; border-color: rgba(255, 180, 171, 0.3);">
              <span class="c-icon" style="font-size: 16px;">delete_sweep</span>
              Reset Vault Cache
            </button>
            <button id="profile-done-btn" class="c-btn c-btn--primary c-btn--sm">Done</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    modal.querySelector('#profile-close-btn').addEventListener('click', () => this.close());
    modal.querySelector('#profile-done-btn').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    modal.querySelector('#profile-clear-cache').addEventListener('click', () => {
      if (confirm('Reset your entire cinema archive and local watch history?')) {
        State.resetStorage();
        Toast.show('Vault archive and cache reset successfully', 'info', 'restore');
        this.close();
        window.location.hash = '#home';
      }
    });
  }

  static renderStats() {
    const stats = State.getStats();
    const rankEl = this.modalEl.querySelector('#user-rank');
    if (rankEl) rankEl.textContent = stats.rank;

    const statsGrid = this.modalEl.querySelector('#profile-stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div style="padding: 12px; border-radius: 10px; background: rgba(18, 33, 49, 0.6); text-align: center; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 20px; font-weight: 800; color: #4cd7f6;">${stats.moviesWatched}</div>
          <div style="font-size: 10px; text-transform: uppercase; color: #8f9195; margin-top: 2px;">Watched</div>
        </div>
        <div style="padding: 12px; border-radius: 10px; background: rgba(18, 33, 49, 0.6); text-align: center; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 20px; font-weight: 800; color: #d0bcff;">${stats.watchlistCount}</div>
          <div style="font-size: 10px; text-transform: uppercase; color: #8f9195; margin-top: 2px;">In Vault</div>
        </div>
        <div style="padding: 12px; border-radius: 10px; background: rgba(18, 33, 49, 0.6); text-align: center; border: 1px solid rgba(255,255,255,0.06);">
          <div style="font-size: 20px; font-weight: 800; color: #facc15;">${stats.totalHours}h</div>
          <div style="font-size: 10px; text-transform: uppercase; color: #8f9195; margin-top: 2px;">Experience</div>
        </div>
      `;
    }
  }

  static open() {
    this.init();
    this.renderStats();
    this.modalEl.classList.add('c-modal--open');
    document.body.style.overflow = 'hidden';
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('c-modal--open');
    document.body.style.overflow = '';
  }
}
