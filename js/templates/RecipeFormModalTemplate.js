/**
 * Template: RecipeFormModalTemplate
 * Responsibility: Markup for creating and editing recipes, dynamic ingredients and steps editors.
 */

import { Icons } from '../components/Icons.js';

export function getRecipeFormModalTemplate() {
  return `
  <dialog id="recipeFormModal" closedby="any" aria-labelledby="formModalTitle">
    <div class="dialog-header">
      <h2 id="formModalTitle" class="dialog-title">Nueva Receta</h2>
      <button class="btn-icon" data-close-dialog title="Cerrar" aria-label="Cerrar">${Icons.close}</button>
    </div>

    <form id="recipeForm" method="dialog">
      <div class="dialog-body">
        <input type="hidden" id="formRecipeId">

        <!-- Title -->
        <div class="form-group">
          <label class="form-label" for="formTitle">Nombre de la Receta *</label>
          <input type="text" id="formTitle" class="form-input" required placeholder="Ej. Lasaña Clásica a la Boloñesa">
        </div>

        <div class="form-row">
          <!-- Category -->
          <div class="form-group">
            <label class="form-label" for="formCategory">Categoría *</label>
            <select id="formCategory" class="form-select" required>
              <option value="desayuno">Desayuno</option>
              <option value="almuerzo" selected>Almuerzo</option>
              <option value="cena">Cena</option>
              <option value="postre">Postre</option>
              <option value="snack">Snack</option>
              <option value="bebida">Bebida</option>
            </select>
          </div>

          <!-- Prep Time -->
          <div class="form-group">
            <label class="form-label" for="formPrepTime">Tiempo (minutos) *</label>
            <input type="number" id="formPrepTime" class="form-input" min="1" max="600" value="30" required>
          </div>
        </div>

        <div class="form-row">
          <!-- Servings (Base) -->
          <div class="form-group">
            <label class="form-label" for="formServings">Porciones Base (para calcular) *</label>
            <input type="number" id="formServings" class="form-input" min="1" max="50" value="4" required>
          </div>

          <!-- Difficulty -->
          <div class="form-group">
            <label class="form-label" for="formDifficulty">Dificultad</label>
            <select id="formDifficulty" class="form-select">
              <option value="Fácil">Fácil</option>
              <option value="Intermedio" selected>Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <!-- Image URL & Presets -->
        <div class="form-group">
          <label class="form-label" for="formImage">URL de la Imagen</label>
          <input type="url" id="formImage" class="form-input" placeholder="https://ejemplo.com/foto-receta.jpg">
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
            Imágenes de ejemplo:
            <span id="presetImagesList" style="display: inline-flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.25rem;">
              <!-- Populated via JS -->
            </span>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-group">
          <label class="form-label" for="formTags">Etiquetas (separadas por comas)</label>
          <input type="text" id="formTags" class="form-input" placeholder="Ej. Pasta, Italiana, Rápido, Casero">
        </div>

        <!-- Dynamic Ingredients Editor -->
        <div class="form-group">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <label class="form-label" style="margin: 0;">Ingredientes *</label>
            <button type="button" id="addIngredientRowBtn" class="btn btn-secondary btn-pill" style="font-size: 0.8rem;">
              ${Icons.plus} Agregar ingrediente
            </button>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            Escribe cantidad, unidad (g, ml, taza, cucharada, etc.) y nombre del ingrediente.
          </p>
          <div id="ingredientsEditorContainer">
            <!-- Dynamic rows -->
          </div>
        </div>

        <!-- Dynamic Steps Editor -->
        <div class="form-group">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <label class="form-label" style="margin: 0;">Pasos de Preparación *</label>
            <button type="button" id="addStepRowBtn" class="btn btn-secondary btn-pill" style="font-size: 0.8rem;">
              ${Icons.plus} Agregar paso
            </button>
          </div>
          <div id="stepsEditorContainer">
            <!-- Dynamic step rows -->
          </div>
        </div>

      </div>

      <div class="dialog-footer">
        <button type="button" class="btn btn-secondary" data-close-dialog>Cancelar</button>
        <button type="submit" id="saveRecipeSubmitBtn" class="btn btn-primary">Guardar Receta</button>
      </div>
    </form>
  </dialog>
  `;
}
