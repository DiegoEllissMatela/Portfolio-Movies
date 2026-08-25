// ==========================================
// CineFlow Notification Center Drawer
// ==========================================
import { State } from '../state.js';

export class NotificationCenter {
  static modalEl = null;

  static init() {
    if (this.modalEl) return;

    const modal = document.createElement('div');
    modal.className = 'c-modal';
    modal.id = 'notifications-modal';
    modal.innerHTML = `
      <div class="c-modal__container" style="max-width: 480px;">
        <button class="c-modal__close" id="notif-close-btn" aria-label="Close">
          <span class="c-icon">close</span>
        </button>
        <div class="c-modal__body" style="padding: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 class="c-modal__title" style="display: flex; align-items: center; gap: 8px; font-size: 1.25rem;">
              <span class="c-icon" style="color: #4cd7f6;">notifications_active</span>
              Nexus Broadcasts
            </h2>
            <button id="notif-mark-read" class="c-btn c-btn--glass c-btn--sm" style="font-size: 11px;">Mark Read</button>
          </div>
          <div id="notif-list-box" style="display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    modal.querySelector('#notif-close-btn').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    const markReadBtn = modal.querySelector('#notif-mark-read');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        State.markNotificationsRead();
        this.renderList();
      });
    }
  }

  static renderList() {
    const listEl = this.modalEl.querySelector('#notif-list-box');
    const notifs = State.getNotifications();

    if (notifs.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; color: #8f9195; padding: 24px;">No new broadcasts.</div>
      `;
      return;
    }

    listEl.innerHTML = notifs.map(n => `
      <div style="padding: 12px 16px; border-radius: 10px; background: ${n.read ? 'rgba(39, 54, 71, 0.2)' : 'rgba(76, 215, 246, 0.1)'}; border: 1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(76, 215, 246, 0.3)'}; display: flex; gap: 12px; align-items: flex-start;">
        <span class="c-icon" style="color: ${n.read ? '#8f9195' : '#4cd7f6'}; font-size: 20px; margin-top: 2px;">${n.icon}</span>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 13px; color: #fff;">${n.title}</div>
            <span style="font-size: 10px; color: #8f9195;">${n.time}</span>
          </div>
          <div style="font-size: 12px; color: #c6c6ca; margin-top: 4px; line-height: 1.4;">${n.msg}</div>
        </div>
      </div>
    `).join('');
  }

  static open() {
    this.init();
    this.renderList();
    this.modalEl.classList.add('c-modal--open');
    document.body.style.overflow = 'hidden';
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('c-modal--open');
    document.body.style.overflow = '';
  }
}
