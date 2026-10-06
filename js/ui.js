/**
 * UI Orchestrator
 * Responsibility: Coordinates components, layout modules, and connects reactive store updates with the DOM.
 */

import { store } from './recipes.js';
import { RecipeCard } from './components/RecipeCard.js';
import { RecipeDetailModal } from './components/RecipeDetailModal.js';
import { RecipeFormModal } from './components/RecipeFormModal.js';
import { PantryWidget } from './components/PantryWidget.js';
import { BackupModal } from './components/BackupModal.js';
import { toast } from './components/Toast.js';
import { Header } from './layout/Header.js';
import { FiltersBar } from './layout/FiltersBar.js';

export class UIManager {
  constructor() {
    this.grid = document.getElementById('recipesGrid');
    this.emptyState = document.getElementById('emptyState');
    this.resultsCount = document.getElementById('resultsCount');
    this.activeFilterBadge = document.getElementById('activeFilterBadge');
  }

  init() {
    this.initDialogBackdrops();

    // 1. Initialize Layout Managers
    this.header = new Header({
      onBrandClick: () => this.resetAllFilters()
    });

    this.filtersBar = new FiltersBar({
      onFilterChanged: () => this.resetAllFilters()
    });

    // 2. Initialize Components
    this.pantry = new PantryWidget();
    this.backupModal = new BackupModal();

    this.recipeFormModal = new RecipeFormModal({
      onSaved: () => this.render()
    });

    this.recipeDetailModal = new RecipeDetailModal({
      onEdit: (recipeId) => this.recipeFormModal.open(recipeId),
      onDeleted: () => this.render()
    });

    // 3. Connect New Recipe Triggers (Desktop Header & Mobile FAB)
    const newDesktopBtn = document.getElementById('newRecipeBtnDesktop');
    const newMobileBtn = document.getElementById('mobileNewRecipeBtn');

    if (newDesktopBtn) newDesktopBtn.onclick = () => this.recipeFormModal.open();
    if (newMobileBtn) newMobileBtn.onclick = () => this.recipeFormModal.open();

    // 4. Initial Render and Subscribe to Store
    this.render();
    store.subscribe(() => this.render());
  }

  /**
   * Modern dialog backdrop click-to-dismiss fallback
   */
  initDialogBackdrops() {
    document.querySelectorAll('dialog').forEach(dialog => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (!isDialogContent) {
            dialog.close();
          }
        });
      }

      dialog.querySelectorAll('[data-close-dialog]').forEach(btn => {
        btn.addEventListener('click', () => dialog.close());
      });
    });
  }

  /**
   * Renders recipe cards into the grid
   */
  render() {
    const filtered = store.getFilteredRecipes();
    const totalCount = store.getRecipes().length;

    this.resultsCount.textContent = `${filtered.length} de ${totalCount} receta${totalCount === 1 ? '' : 's'}`;

    // Filter badge description
    let filterDescription = '';
    if (store.filters.onlyFavorites) filterDescription += 'Solo favoritas ';
    if (store.filters.category !== 'todas') filterDescription += `• Categoría: ${store.filters.category} `;
    if (store.filters.maxTime > 0) filterDescription += `• ≤ ${store.filters.maxTime} min `;
    if (store.filters.pantryMode && store.filters.pantryIngredients.length > 0) {
      filterDescription += `• Despensa (${store.filters.pantryIngredients.length} ing.) `;
    }
    this.activeFilterBadge.innerHTML = filterDescription ? `<span class="badge badge-amber">${filterDescription}</span>` : '';

    if (filtered.length === 0) {
      this.grid.style.display = 'none';
      this.emptyState.style.display = 'block';
      return;
    }

    this.grid.style.display = 'grid';
    this.emptyState.style.display = 'none';
    this.grid.innerHTML = '';

    filtered.forEach(recipe => {
      const card = RecipeCard.create(recipe, (id) => {
        this.recipeDetailModal.open(id);
      });
      this.grid.appendChild(card);
    });
  }

  resetAllFilters() {
    this.filtersBar.reset();
    this.pantry.reset();
    store.notify();
    toast.info('Filtros restablecidos.');
  }
}

export const ui = new UIManager();
