/**
 * Component: PantryWidget
 * Responsibility: Manages the "¿Qué tengo en casa?" pantry search interface, ingredient chips, and quick suggestions.
 */

import { store } from '../recipes.js';
import { POPULAR_PANTRY_INGREDIENTS } from '../pantry.js';

export class PantryWidget {
  constructor() {
    this.section = document.getElementById('pantrySection');
    this.toggleBtn = document.getElementById('togglePantryBtn');
    this.countBadge = document.getElementById('pantryCountBadge');
    this.suggestionsEl = document.getElementById('pantrySuggestions');
    this.tagsContainer = document.getElementById('pantryTagsContainer');
    this.input = document.getElementById('pantryInput');
    this.addBtn = document.getElementById('addPantryItemBtn');
    this.clearBtn = document.getElementById('clearAllPantryBtn');

    this.setup();
  }

  setup() {
    // Toggle collapsible section
    this.toggleBtn.onclick = () => {
      const isVisible = this.section.style.display !== 'none';
      if (isVisible) {
        this.section.style.display = 'none';
        store.setPantryMode(false);
        this.toggleBtn.classList.remove('active');
      } else {
        this.section.style.display = 'flex';
        store.setPantryMode(true);
        this.toggleBtn.classList.add('active');
        this.input.focus();
      }
      this.renderChips();
    };

    // Render popular suggestions
    this.suggestionsEl.innerHTML = '';
    POPULAR_PANTRY_INGREDIENTS.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pantry-suggestion-btn';
      btn.textContent = `+ ${item}`;
      btn.onclick = () => {
        store.addPantryIngredient(item);
        this.renderChips();
      };
      this.suggestionsEl.appendChild(btn);
    });

    // Add custom ingredient
    const addCustom = () => {
      const val = this.input.value.trim();
      if (val) {
        store.addPantryIngredient(val);
        this.input.value = '';
        this.renderChips();
      }
    };

    this.addBtn.onclick = addCustom;
    this.input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustom();
      }
    };

    this.clearBtn.onclick = () => {
      store.clearPantryIngredients();
      this.renderChips();
    };

    this.renderChips();
  }

  renderChips() {
    const list = store.filters.pantryIngredients;
    this.tagsContainer.innerHTML = '';

    if (list.length > 0) {
      this.countBadge.style.display = 'inline-block';
      this.countBadge.textContent = list.length;
    } else {
      this.countBadge.style.display = 'none';
      this.tagsContainer.innerHTML = `
        <span style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
          Aún no has añadido ingredientes a tu despensa.
        </span>
      `;
      return;
    }

    list.forEach(item => {
      const chip = document.createElement('span');
      chip.className = 'pantry-chip';
      chip.innerHTML = `
        ${item}
        <button type="button" class="pantry-chip-remove" title="Quitar ${item}">✕</button>
      `;

      chip.querySelector('.pantry-chip-remove').onclick = () => {
        store.removePantryIngredient(item);
        this.renderChips();
      };

      this.tagsContainer.appendChild(chip);
    });
  }

  reset() {
    this.section.style.display = 'none';
    this.toggleBtn.classList.remove('active');
    store.setPantryMode(false);
    store.clearPantryIngredients();
    this.renderChips();
  }
}
