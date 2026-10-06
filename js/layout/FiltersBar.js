/**
 * Layout: FiltersBar
 * Responsibility: Manages the search input, category navigation pills, time limit selector, and favorites filter.
 */

import { store } from '../recipes.js';

export class FiltersBar {
  constructor({ onFilterChanged }) {
    this.searchInput = document.getElementById('recipeSearchInput');
    this.clearSearchBtn = document.getElementById('clearSearchBtn');
    this.categoryPills = document.querySelectorAll('#categoryPills .btn-pill');
    this.timeFilter = document.getElementById('timeFilterSelect');
    this.favFilterBtn = document.getElementById('favoritesFilterBtn');
    this.resetBtn = document.getElementById('resetFiltersBtn');
    this.onFilterChanged = onFilterChanged;

    this.debounceTimer = null;
    this.setup();
  }

  setup() {
    // Search input
    this.searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      this.clearSearchBtn.style.display = val ? 'block' : 'none';

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        store.setSearch(val);
      }, 150);
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearSearchBtn.style.display = 'none';
      store.setSearch('');
      this.searchInput.focus();
    });

    // Category pills
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-category');
        store.setCategory(cat);
      });
    });

    // Time filter dropdown
    this.timeFilter.addEventListener('change', (e) => {
      store.setMaxTime(e.target.value);
    });

    // Favorites toggle
    this.favFilterBtn.addEventListener('click', () => {
      store.toggleOnlyFavorites();
      if (store.filters.onlyFavorites) {
        this.favFilterBtn.classList.add('active');
      } else {
        this.favFilterBtn.classList.remove('active');
      }
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (this.onFilterChanged) this.onFilterChanged();
      });
    }
  }

  reset() {
    this.searchInput.value = '';
    this.clearSearchBtn.style.display = 'none';
    store.setSearch('');

    this.categoryPills.forEach(p => p.classList.remove('active'));
    const defaultPill = document.querySelector('#categoryPills [data-category="todas"]');
    if (defaultPill) defaultPill.classList.add('active');
    store.setCategory('todas');

    this.timeFilter.value = '0';
    store.setMaxTime(0);

    this.favFilterBtn.classList.remove('active');
    store.filters.onlyFavorites = false;
  }
}
