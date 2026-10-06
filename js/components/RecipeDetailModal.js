/**
 * Component: RecipeDetailModal
 * Responsibility: Manages the detailed cooking view, servings scaling, checklists, and kitchen timer.
 */

import { store } from '../recipes.js';
import { scaleIngredient } from '../scaler.js';
import { getRecipeDetailModalTemplate } from '../templates/RecipeDetailModalTemplate.js';
import { KitchenTimer } from './KitchenTimer.js';
import { toast } from './Toast.js';
import { Icons } from './Icons.js';

export class RecipeDetailModal {
  constructor({ onEdit, onDeleted }) {
    this.ensureDOM();
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

  ensureDOM() {
    let modal = document.getElementById('recipeDetailModal');
    if (!modal) {
      const container = document.getElementById('modalsContainer') || document.body;
      container.insertAdjacentHTML('beforeend', getRecipeDetailModalTemplate());
      modal = document.getElementById('recipeDetailModal');
    }
    this.modal = modal;

    // Modal close buttons
    this.modal.querySelectorAll('[data-close-dialog]').forEach(btn => {
      btn.onclick = () => this.close();
    });

    // Backdrop click dismiss fallback
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        const rect = this.modal.getBoundingClientRect();
        const isInContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isInContent) this.close();
      }
    });
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
    const totalIngredients = (recipe.ingredients || []).length;

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

    // Render cooking steps without redundant checkboxes
    const stepsHTML = (recipe.steps || []).map((step, idx) => {
      return `
        <div class="cooking-step-card" data-step-idx="${idx}">
          <div class="cooking-step-indicator">${idx + 1}</div>
          <div class="cooking-step-text">${step}</div>
        </div>
      `;
    }).join('');

    const tagsHTML = (recipe.tags || []).map(t => `<span class="badge badge-secondary">#${t}</span>`).join(' ');
    const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
    const catKey = recipe.category.toLowerCase();
    const catIcon = Icons[catKey] || Icons.all;

    this.body.innerHTML = `
      <!-- Hero Image -->
      <div class="recipe-detail-hero">
        <img src="${imageUrl}" alt="${recipe.title}">
      </div>

      <!-- Title & Tags -->
      <div style="margin-bottom: 0.75rem;">
        <h2 id="detailRecipeTitle" style="font-size: 1.85rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; line-height: 1.25;">
          ${recipe.title}
        </h2>
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
          ${tagsHTML}
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="recipe-metrics-strip">
        <div class="metric-pill">
          <div class="metric-pill-icon">${Icons.clock}</div>
          <div class="metric-pill-text">
            <strong>${recipe.prepTime} min</strong>
            <span>Preparación</span>
          </div>
        </div>
        <div class="metric-pill">
          <div class="metric-pill-icon">${catIcon}</div>
          <div class="metric-pill-text">
            <strong>${recipe.category}</strong>
            <span>Categoría</span>
          </div>
        </div>
        <div class="metric-pill">
          <div class="metric-pill-icon">${Icons.users}</div>
          <div class="metric-pill-text">
            <strong>${targetServings} personas</strong>
            <span>${targetServings !== baseServings ? `Base: ${baseServings}` : 'Porción base'}</span>
          </div>
        </div>
        <div class="metric-pill">
          <div class="metric-pill-icon">${Icons.chefHat}</div>
          <div class="metric-pill-text">
            <strong>${recipe.difficulty || 'Intermedio'}</strong>
            <span>Dificultad</span>
          </div>
        </div>
      </div>

      <!-- Scaler Control Card -->
      <div class="scaler-card">
        <div class="scaler-info">
          <span class="scaler-info-title">
            ${Icons.users}
            Escalar Porciones
          </span>
          <span class="scaler-info-hint">
            ${targetServings !== baseServings 
              ? `Ingredientes recalculados para ${targetServings} comensales (Receta original para ${baseServings})` 
              : `Ajusta para cuántas personas cocinarás y las cantidades se actualizarán`}
          </span>
        </div>
        <div class="servings-scaler">
          <button class="scaler-btn" id="btnScaleDown" title="Menos porciones" aria-label="Menos porciones">−</button>
          <span class="scaler-value" id="scalerDisplay">${targetServings} pers.</span>
          <button class="scaler-btn" id="btnScaleUp" title="Más porciones" aria-label="Más porciones">+</button>
        </div>
      </div>

      <!-- Ingredients Section -->
      <div style="margin-top: 1.5rem;">
        <div class="ingredients-header">
          <h3 style="font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
            ${Icons.ingredients}
            Ingredientes (${totalIngredients})
          </h3>
          <span class="ingredients-progress" id="ingProgressBadge">0 de ${totalIngredients} listos</span>
        </div>
        <div class="ingredients-container" id="detailIngredientsContainer">
          ${ingredientsHTML}
        </div>
      </div>

      <!-- Preparation Steps -->
      <div style="margin-top: 2rem;">
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
          ${Icons.chefHat}
          Preparación Paso a Paso
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
          Toca cualquier paso para marcarlo como completado durante la preparación:
        </p>
        <div class="steps-container" id="detailStepsContainer">
          ${stepsHTML}
        </div>
      </div>

      <!-- Cooking Timer Mount Point -->
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

    // Hook Ingredients Progress
    const updateIngProgress = () => {
      const total = this.body.querySelectorAll('.check-item input[type="checkbox"]').length;
      const checked = this.body.querySelectorAll('.check-item input[type="checkbox"]:checked').length;
      const badge = this.body.querySelector('#ingProgressBadge');
      if (badge) {
        badge.textContent = `${checked} de ${total} listos`;
        if (checked === total && total > 0) {
          badge.style.borderColor = 'var(--color-accent)';
          badge.style.color = 'var(--color-accent)';
        }
      }
    };

    this.body.querySelectorAll('.check-item input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const item = e.target.closest('.check-item');
        if (e.target.checked) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
        updateIngProgress();
      });
    });

    // Hook Step Cards Completion
    this.body.querySelectorAll('.cooking-step-card').forEach(card => {
      card.onclick = () => {
        const isDone = card.classList.toggle('completed');
        const indicator = card.querySelector('.cooking-step-indicator');
        const idx = Number(card.getAttribute('data-step-idx'));
        if (indicator) {
          indicator.innerHTML = isDone 
            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` 
            : String(idx + 1);
        }
      };
    });

    // Mount Kitchen Timer
    const timerMount = this.body.querySelector('#cookingTimerContainer');
    this.timer.attach(timerMount, recipe.prepTime);
  }
}
