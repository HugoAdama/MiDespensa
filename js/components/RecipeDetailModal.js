/**
 * Component: RecipeDetailModal
 * Responsibility: Manages the detailed cooking view, servings scaling, checklists, and kitchen timer.
 */

import { store } from '../recipes.js';
import { scaleIngredient } from '../scaler.js';
import { KitchenTimer } from './KitchenTimer.js';
import { toast } from './Toast.js';
import { Icons } from './Icons.js';

export class RecipeDetailModal {
  constructor({ onEdit, onDeleted }) {
    this.modal = document.getElementById('recipeDetailModal');
    this.body = document.getElementById('recipeDetailBody');
    this.catBadge = document.getElementById('detailCategoryBadge');
    this.timeBadge = document.getElementById('detailTimeBadge');
    this.editBtn = document.getElementById('detailEditBtn');
    this.duplicateBtn = document.getElementById('detailDuplicateBtn');
    this.deleteBtn = document.getElementById('detailDeleteBtn');

    this.onEdit = onEdit;
    this.onDeleted = onDeleted;
    this.timer = new KitchenTimer();
    this.currentRecipe = null;
    this.currentServings = 4;

    this.setupStaticActions();
  }

  setupStaticActions() {
    this.editBtn.onclick = () => {
      if (this.currentRecipe && this.onEdit) {
        this.close();
        this.onEdit(this.currentRecipe.id);
      }
    };

    this.duplicateBtn.onclick = async () => {
      if (this.currentRecipe) {
        const copy = await store.duplicateRecipe(this.currentRecipe.id);
        this.close();
        toast.success(`Copia creada: "${copy.title}"`);
      }
    };

    this.deleteBtn.onclick = async () => {
      if (this.currentRecipe && confirm(`¿Estás seguro de que deseas eliminar la receta "${this.currentRecipe.title}"?`)) {
        await store.deleteRecipe(this.currentRecipe.id);
        this.close();
        toast.info('Receta eliminada.');
        if (this.onDeleted) this.onDeleted();
      }
    };
  }

  open(recipeId) {
    const recipe = store.getRecipeById(recipeId);
    if (!recipe) return;

    this.currentRecipe = recipe;
    this.currentServings = Number(recipe.servings) || 4;

    const catKey = recipe.category.toLowerCase();
    const catIcon = Icons[catKey] || Icons.all;

    this.catBadge.innerHTML = `${catIcon} ${recipe.category}`;
    this.timeBadge.innerHTML = `${Icons.clock} ${recipe.prepTime} min`;

    this.render();
    this.modal.showModal();
  }

  close() {
    this.timer.stop();
    this.modal.close();
  }

  render() {
    const recipe = this.currentRecipe;
    if (!recipe) return;

    const baseServings = Number(recipe.servings) || 4;
    const targetServings = this.currentServings;

    // Render scaled ingredients
    const ingredientsHTML = (recipe.ingredients || []).map((ing, idx) => {
      const scaledText = scaleIngredient(ing, baseServings, targetServings);
      return `
        <label class="check-item" data-idx="${idx}">
          <input type="checkbox" aria-label="Ingrediente listo">
          <span>${scaledText}</span>
        </label>
      `;
    }).join('');

    // Render cooking steps
    const stepsHTML = (recipe.steps || []).map((step, idx) => {
      return `
        <div class="step-item">
          <div class="step-num">${idx + 1}</div>
          <div class="step-content">
            <label class="check-item" style="padding: 0;">
              <input type="checkbox" aria-label="Marcar paso como completado">
              <span>${step}</span>
            </label>
          </div>
        </div>
      `;
    }).join('');

    const tagsHTML = (recipe.tags || []).map(t => `<span class="badge badge-secondary">#${t}</span>`).join(' ');
    const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

    this.body.innerHTML = `
      <!-- Hero Image -->
      <div style="position: relative; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1.5rem; max-height: 280px;">
        <img src="${imageUrl}" alt="${recipe.title}" style="width: 100%; height: 260px; object-fit: cover;">
      </div>

      <!-- Header & Servings Scaler -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <h2 id="detailRecipeTitle" style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.35rem;">
            ${recipe.title}
          </h2>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
            ${tagsHTML}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
            Escalar Porciones
          </span>
          <div class="servings-scaler">
            <button class="scaler-btn" id="btnScaleDown" title="Menos porciones">−</button>
            <span class="scaler-value" id="scalerDisplay">
              ${targetServings} pers.
            </span>
            <button class="scaler-btn" id="btnScaleUp" title="Más porciones">+</button>
          </div>
          ${targetServings !== baseServings ? `<span style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">(Base: ${baseServings})</span>` : ''}
        </div>
      </div>

      <!-- Ingredients List -->
      <div style="margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
            ${Icons.ingredients}
            Ingredientes (${(recipe.ingredients || []).length})
          </h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Toca para tachar lo que tengas listo
          </span>
        </div>
        <div id="detailIngredientsContainer" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 0.75rem;">
          ${ingredientsHTML}
        </div>
      </div>

      <!-- Preparation Steps -->
      <div style="margin-top: 2rem;">
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          ${Icons.chefHat}
          Preparación Paso a Paso
        </h3>
        <div id="detailStepsContainer">
          ${stepsHTML}
        </div>
      </div>

      <!-- Cooking Timer Widget Mount Point -->
      <div id="cookingTimerContainer" class="cooking-timer"></div>
    `;

    // Hook Scaler Controls
    const downBtn = this.body.querySelector('#btnScaleDown');
    const upBtn = this.body.querySelector('#btnScaleUp');

    downBtn.onclick = () => {
      if (this.currentServings > 1) {
        this.currentServings--;
        this.render();
      }
    };

    upBtn.onclick = () => {
      if (this.currentServings < 50) {
        this.currentServings++;
        this.render();
      }
    };

    // Hook Checkbox Styles
    this.body.querySelectorAll('.check-item input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const item = e.target.closest('.check-item');
        if (e.target.checked) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
      });
    });

    // Mount Kitchen Timer
    const timerMount = this.body.querySelector('#cookingTimerContainer');
    this.timer.attach(timerMount, recipe.prepTime);
  }
}
