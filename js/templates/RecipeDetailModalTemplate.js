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
      <div style="margin-right: auto; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button id="detailEditBtn" class="btn btn-secondary">
          ${Icons.edit}
          Editar
        </button>
        <button id="detailDuplicateBtn" class="btn btn-secondary" title="Duplicar como nueva receta">
          ${Icons.copy}
          Duplicar
        </button>
        <button id="detailDeleteBtn" class="btn btn-danger" title="Eliminar receta">
          ${Icons.trash}
          Eliminar
        </button>
      </div>
      <button class="btn btn-primary" data-close-dialog>Cerrar</button>
    </div>
  </dialog>
  `;
}
