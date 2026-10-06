/**
 * Layout: Header
 * Responsibility: Manages top header, branding, network status, theme toggling, and PWA installation prompt.
 */

import { toast } from '../components/Toast.js';
import { Icons } from '../components/Icons.js';

export class Header {
  constructor({ onBrandClick }) {
    this.brandLogo = document.getElementById('brandLogo');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.themeIcon = document.getElementById('themeIcon');
    this.connectionBadge = document.getElementById('connectionBadge');
    this.connectionText = document.getElementById('connectionText');
    this.installBtn = document.getElementById('installAppBtn');
    this.onBrandClick = onBrandClick;
    this.deferredPrompt = null;

    this.init();
  }

  init() {
    this.initTheme();
    this.initNetworkWatcher();
    this.initPWAInstaller();

    if (this.brandLogo && this.onBrandClick) {
      this.brandLogo.onclick = this.onBrandClick;
      this.brandLogo.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onBrandClick();
        }
      };
    }
  }

  initTheme() {
    const saved = localStorage.getItem('saborcraft_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    this.themeIcon.innerHTML = initialTheme === 'dark' ? Icons.sun : Icons.moon;

    this.themeToggleBtn.onclick = () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('saborcraft_theme', next);
      this.themeIcon.innerHTML = next === 'dark' ? Icons.sun : Icons.moon;
    };
  }

  initNetworkWatcher() {
    const update = () => {
      if (navigator.onLine) {
        this.connectionBadge.classList.remove('is-offline');
        this.connectionText.textContent = 'En línea';
        this.connectionBadge.title = 'Conectado a Internet';
      } else {
        this.connectionBadge.classList.add('is-offline');
        this.connectionText.textContent = 'Sin conexión';
        this.connectionBadge.title = 'Modo sin conexión activo (PWA)';
        toast.info('Estás sin conexión. Todas las funciones e IndexedDB siguen disponibles.');
      }
    };

    window.addEventListener('online', () => {
      update();
      toast.success('Conexión reestablecida.');
    });

    window.addEventListener('offline', update);
    update();
  }

  initPWAInstaller() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installBtn.style.display = 'inline-flex';
    });

    this.installBtn.onclick = async () => {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('¡Gracias por instalar SaborCraft! 🚀');
      }
      this.deferredPrompt = null;
      this.installBtn.style.display = 'none';
    };

    window.addEventListener('appinstalled', () => {
      this.installBtn.style.display = 'none';
      toast.success('SaborCraft se ha instalado correctamente.');
    });
  }
}
