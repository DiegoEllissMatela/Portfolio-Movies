// ==========================================
// CineFlow Toast Notification Component
// ==========================================

export class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'c-toast-container';
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = 'success', icon = 'check_circle', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `c-toast c-toast--${type}`;
    toast.innerHTML = `
      <span class="c-icon c-toast__icon">${icon}</span>
      <span class="c-toast__msg">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
