/**
 * Component: KitchenTimer
 * Responsibility: Manages countdown cooking timers with audio notifications via Web Audio API.
 */

import { toast } from './Toast.js';
import { Icons } from './Icons.js';

export class KitchenTimer {
  constructor() {
    this.timerInterval = null;
    this.secondsRemaining = 0;
    this.isRunning = false;
    this.defaultMinutes = 10;
  }

  attach(container, defaultMinutes = 10) {
    this.stop();
    this.defaultMinutes = Number(defaultMinutes) || 10;
    this.secondsRemaining = this.defaultMinutes * 60;

    container.innerHTML = `
      <div class="timer-info">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <h4 class="timer-title">
            ${Icons.timer}
            Temporizador de Cocina
          </h4>
          <span class="timer-status-badge" id="timerStatusBadge">En pausa</span>
        </div>
        <span style="font-size: 0.82rem; color: var(--text-secondary);">Controla los tiempos de cocción sin salir de la receta</span>
      </div>
      <div class="timer-controls-group">
        <div class="timer-digits-container">
          <div class="timer-digits" id="timerDigits">00:00</div>
        </div>
        <div class="timer-buttons-row">
          <button id="timerPresetBtn" class="btn btn-secondary btn-pill" style="font-size: 0.8rem;" title="Cambiar duración">
            ${this.defaultMinutes} min
          </button>
          <button id="timerToggleBtn" class="btn btn-primary btn-pill" style="font-size: 0.8rem;">
            Iniciar
          </button>
          <button id="timerResetBtn" class="btn btn-secondary btn-pill" style="font-size: 0.8rem;">
            Reiniciar
          </button>
        </div>
      </div>
    `;

    this.digitsEl = container.querySelector('#timerDigits');
    this.statusBadgeEl = container.querySelector('#timerStatusBadge');
    this.toggleBtn = container.querySelector('#timerToggleBtn');
    this.resetBtn = container.querySelector('#timerResetBtn');
    this.presetBtn = container.querySelector('#timerPresetBtn');

    this.updateDisplay();

    this.toggleBtn.onclick = () => this.toggle();
    this.resetBtn.onclick = () => this.reset();
    this.presetBtn.onclick = () => this.promptCustomMinutes();
  }

  updateDisplay() {
    if (!this.digitsEl) return;
    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    this.digitsEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.secondsRemaining <= 0) {
      this.secondsRemaining = this.defaultMinutes * 60;
    }
    this.isRunning = true;
    if (this.toggleBtn) this.toggleBtn.textContent = 'Pausar';
    if (this.statusBadgeEl) {
      this.statusBadgeEl.textContent = 'En cocción';
      this.statusBadgeEl.classList.add('active');
    }

    this.timerInterval = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
        this.updateDisplay();
      } else {
        this.stop();
        if (this.toggleBtn) this.toggleBtn.textContent = 'Iniciar';
        if (this.statusBadgeEl) {
          this.statusBadgeEl.textContent = '¡Completado!';
          this.statusBadgeEl.classList.remove('active');
        }
        this.playChime();
        toast.info('¡Tiempo terminado! Revisa tu preparación.');
      }
    }, 1000);
  }

  pause() {
    this.stop();
    if (this.toggleBtn) this.toggleBtn.textContent = 'Reanudar';
    if (this.statusBadgeEl) {
      this.statusBadgeEl.textContent = 'En pausa';
      this.statusBadgeEl.classList.remove('active');
    }
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isRunning = false;
    if (this.statusBadgeEl && this.secondsRemaining > 0) {
      this.statusBadgeEl.textContent = 'En pausa';
      this.statusBadgeEl.classList.remove('active');
    }
  }

  reset() {
    this.stop();
    this.secondsRemaining = this.defaultMinutes * 60;
    if (this.toggleBtn) this.toggleBtn.textContent = 'Iniciar';
    this.updateDisplay();
  }

  promptCustomMinutes() {
    const custom = prompt('Ingresa los minutos para el temporizador:', this.defaultMinutes);
    if (custom && !isNaN(custom) && Number(custom) > 0) {
      this.stop();
      this.defaultMinutes = Math.round(Number(custom));
      this.secondsRemaining = this.defaultMinutes * 60;
      if (this.presetBtn) this.presetBtn.textContent = `${this.defaultMinutes} min`;
      if (this.toggleBtn) this.toggleBtn.textContent = 'Iniciar';
      this.updateDisplay();
    }
  }

  playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(587.33, 0, 0.4);
      playTone(880, 0.25, 0.6);
      playTone(1174.66, 0.5, 0.8);
    } catch (e) {
      console.warn('Web Audio chime unavailable:', e);
    }
  }
}
