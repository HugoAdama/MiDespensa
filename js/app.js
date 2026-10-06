/**
 * Application Entry Point
 * Bootstraps the application, registers PWA Service Worker, and starts the reactive UI orchestrator.
 */

import { store } from './recipes.js';
import { ui } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Register PWA Service Worker for offline capability
  registerServiceWorker();

  // 2. Load IndexedDB persistent recipes data
  await store.load();

  // 3. Initialize modular UI layout and components
  ui.init();
});

/**
 * Registers PWA Service Worker
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('Service Worker registrado en ámbito:', reg.scope);
        })
        .catch((err) => {
          console.warn('Error al registrar Service Worker:', err);
        });
    });
  }
}
