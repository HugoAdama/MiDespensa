/**
 * Component: Toast Notifications
 * Responsibility: Displays non-intrusive floating feedback messages to the user.
 */

export class Toast {
  constructor(containerId = 'toastContainer') {
    this.container = document.getElementById(containerId);
  }

  show(message, type = 'success', duration = 3500) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
    toast.textContent = message;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message, duration) {
    this.show(message, 'success', duration);
  }

  error(message, duration) {
    this.show(message, 'error', duration);
  }

  info(message, duration) {
    this.show(message, 'info', duration);
  }
}

export const toast = new Toast();
