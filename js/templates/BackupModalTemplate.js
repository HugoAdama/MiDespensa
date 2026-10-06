/**
 * Template: BackupModalTemplate
 * Responsibility: Markup for backup modal, JSON recipe export and import cards.
 */

import { Icons } from '../components/Icons.js';

export function getBackupModalTemplate() {
  return `
  <dialog id="backupModal" closedby="any" aria-labelledby="backupModalTitle">
    <div class="dialog-header">
      <h2 id="backupModalTitle" class="dialog-title">Copia de Seguridad y Migración</h2>
      <button class="btn-icon" data-close-dialog title="Cerrar" aria-label="Cerrar">${Icons.close}</button>
    </div>

    <div class="dialog-body">
      <!-- Export Section -->
      <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
          ${Icons.download}
          Exportar tus Recetas
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Descarga todas tus recetas en un archivo estándar <strong>.json</strong>. Podrás guardarlo en tu computadora, compartirlo o recuperarlo en cualquier navegador.
        </p>
        <button id="exportJSONBtn" class="btn btn-primary">
          ${Icons.download}
          Descargar Archivo JSON
        </button>
      </div>

      <!-- Import Section -->
      <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
          ${Icons.upload}
          Importar Recetas
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Selecciona un archivo de recetas previo en formato JSON:
        </p>

        <input type="file" id="importFileInput" accept=".json,application/json" class="form-input" style="padding: 0.5rem; margin-bottom: 1rem;">

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button id="importMergeBtn" class="btn btn-secondary">
            Combinar con las actuales
          </button>
          <button id="importReplaceBtn" class="btn btn-danger">
            Reemplazar todo
          </button>
        </div>
      </div>
    </div>

    <div class="dialog-footer">
      <button class="btn btn-secondary" data-close-dialog>Cerrar</button>
    </div>
  </dialog>
  `;
}
