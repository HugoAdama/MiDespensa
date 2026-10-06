/**
 * Component: RecipeCard
 * Responsibility: Renders a single recipe card and manages its interactions (favorites, view).
 */

import { store } from '../recipes.js';
import { toast } from './Toast.js';
import { Icons } from './Icons.js';

export class RecipeCard {
  static create(recipe, onSelect) {
    const card = document.createElement('article');
    card.className = 'recipe-card animate-fade-in';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver receta: ${recipe.title}`);

    const catKey = recipe.category.toLowerCase();
    const categoryIcon = Icons[catKey] || Icons.all;

    // Pantry matching badge if pantry mode is active
    let pantryBadgeHTML = '';
    if (typeof recipe.matchPercentage === 'number' && store.filters.pantryMode && store.filters.pantryIngredients.length > 0) {
      if (recipe.matchPercentage === 100) {
        pantryBadgeHTML = `<span class="badge badge-success card-pantry-badge">${Icons.sparkles} 100% Listo para cocinar</span>`;
      } else if (recipe.matchPercentage > 0) {
        const missing = recipe.totalIngredients - recipe.matchCount;
        pantryBadgeHTML = `<span class="badge badge-amber card-pantry-badge">${recipe.matchPercentage}% en despensa (faltan ${missing})</span>`;
      } else {
        pantryBadgeHTML = `<span class="badge badge-secondary card-pantry-badge" style="opacity: 0.85;">0% en despensa</span>`;
      }
    }

    const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
    const favIcon = recipe.favorite ? Icons.starFilled : Icons.starOutline;

    card.innerHTML = `
      <div class="card-img-wrap">
        <img class="card-img" src="${imageUrl}" alt="${recipe.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'">
        <button class="card-fav-btn ${recipe.favorite ? 'is-fav' : ''}" title="${recipe.favorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}" aria-label="Favorita">
          ${favIcon}
        </button>
        ${pantryBadgeHTML}
      </div>
      <div class="card-content">
        <div class="card-meta-top">
          <span class="badge badge-primary">${categoryIcon} ${recipe.category}</span>
          <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">${recipe.difficulty || 'Fácil'}</span>
        </div>
        <h3 class="card-title">${recipe.title}</h3>
        <div class="card-info-row">
          <span class="card-info-item">
            ${Icons.clock}
            ${recipe.prepTime} min
          </span>
          <span class="card-info-item">
            ${Icons.users}
            ${recipe.servings || 4} porc.
          </span>
          <span class="card-info-item" style="margin-left: auto;">
            ${(recipe.ingredients || []).length} ingr.
          </span>
        </div>
      </div>
    `;

    // Favorite button click
    const favBtn = card.querySelector('.card-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      store.toggleFavorite(recipe.id);
      toast.success(recipe.favorite ? 'Eliminada de favoritas' : 'Añadida a favoritas');
    });

    // Card select action
    card.addEventListener('click', () => {
      if (onSelect) onSelect(recipe.id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onSelect) onSelect(recipe.id);
      }
    });

    return card;
  }
}
