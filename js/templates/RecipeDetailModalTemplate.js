/**
 * Template: RecipeDetailModalTemplate
 * Responsibility: Markup for recipe detail view, scaling controls, cooking checklist, and actions.
 */

import { Icons } from '../components/Icons.js';

export function getRecipeDetailModalTemplate() {
  return `
  <dialog id="recipeDetailModal" closedby="any" aria-labelledby="detailRecipeTitle">
    <div class="dialog-header">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span id="detailCategoryBadge" class="badge badge-primary">Categoría</span>
        <span id="detailTimeBadge" class="badge badge-secondary">0 min</span>
      </div>
      <button class="btn-icon" data-close-dialog title="Cerrar ventana" aria-label="Cerrar">${Icons.close}</button>
    </div>

    <div class="dialog-body" id="recipeDetailBody">
      <!-- Dynamic recipe view injected via RecipeDetailModal.js -->
    </div>

    <div class="dialog-footer">
      <div class="modal-footer-actions">
        <button id="detailEditBtn" class="btn-modal-action btn-modal-secondary" title="Editar receta">
          ${Icons.edit}
          <span>Editar</span>
        </button>
        <button id="detailDuplicateBtn" class="btn-modal-action btn-modal-secondary" title="Duplicar como nueva receta">
          ${Icons.copy}
          <span>Duplicar</span>
        </button>
        <button id="detailDeleteBtn" class="btn-modal-action btn-modal-danger" title="Eliminar receta">
          ${Icons.trash}
          <span>Eliminar</span>
        </button>
      </div>
      <button class="btn-modal-action btn-modal-primary" data-close-dialog title="Cerrar vista de cocción">
        <span>Cerrar</span>
      </button>
    </div>
  </dialog>
  `;
}
