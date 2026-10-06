/**
 * Recipe State Management Module
 */

import { db } from './db.js';
import { calculatePantryMatches } from './pantry.js';
import { normalizeText } from './scaler.js';

class RecipeStore {
  constructor() {
    this.recipes = [];
    this.filters = {
      search: '',
      category: 'todas',
      maxTime: 0, // 0 = unlimited
      onlyFavorites: false,
      pantryMode: false,
      pantryIngredients: []
    };
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this));
  }

  async load() {
    await db.init();
    this.recipes = await db.getAll();
    this.notify();
  }

  getRecipes() {
    return this.recipes;
  }

  getRecipeById(id) {
    return this.recipes.find(r => r.id === id) || null;
  }

  setSearch(query) {
    this.filters.search = query || '';
    this.notify();
  }

  setCategory(category) {
    this.filters.category = category || 'todas';
    this.notify();
  }

  setMaxTime(minutes) {
    this.filters.maxTime = Number(minutes) || 0;
    this.notify();
  }

  toggleOnlyFavorites() {
    this.filters.onlyFavorites = !this.filters.onlyFavorites;
    this.notify();
  }

  setPantryMode(enabled) {
    this.filters.pantryMode = Boolean(enabled);
    this.notify();
  }

  setPantryIngredients(ingredients) {
    this.filters.pantryIngredients = ingredients || [];
    this.notify();
  }

  addPantryIngredient(ingredient) {
    const trimmed = ingredient.trim();
    if (!trimmed) return;
    const exists = this.filters.pantryIngredients.some(
      item => normalizeText(item) === normalizeText(trimmed)
    );
    if (!exists) {
      this.filters.pantryIngredients.push(trimmed);
      this.notify();
    }
  }

  removePantryIngredient(ingredient) {
    this.filters.pantryIngredients = this.filters.pantryIngredients.filter(
      item => normalizeText(item) !== normalizeText(ingredient)
    );
    this.notify();
  }

  clearPantryIngredients() {
    this.filters.pantryIngredients = [];
    this.notify();
  }

  async addRecipe(recipeData) {
    const newRecipe = {
      ...recipeData,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: Boolean(recipeData.favorite)
    };
    await db.save(newRecipe);
    this.recipes.unshift(newRecipe);
    this.notify();
    return newRecipe;
  }

  async updateRecipe(id, recipeData) {
    const existing = this.getRecipeById(id);
    if (!existing) {
      throw new Error(`Receta con ID ${id} no encontrada.`);
    }

    const updated = {
      ...existing,
      ...recipeData,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    await db.save(updated);
    const index = this.recipes.findIndex(r => r.id === id);
    if (index >= 0) {
      this.recipes[index] = updated;
    }
    this.notify();
    return updated;
  }

  async deleteRecipe(id) {
    await db.delete(id);
    this.recipes = this.recipes.filter(r => r.id !== id);
    this.notify();
  }

  async toggleFavorite(id) {
    const recipe = this.getRecipeById(id);
    if (!recipe) return;

    recipe.favorite = !recipe.favorite;
    recipe.updatedAt = new Date().toISOString();
    await db.save(recipe);
    this.notify();
  }

  async duplicateRecipe(id) {
    const original = this.getRecipeById(id);
    if (!original) return null;

    const copy = {
      ...original,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: `${original.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.save(copy);
    this.recipes.unshift(copy);
    this.notify();
    return copy;
  }

  async replaceAll(newRecipes) {
    await db.clear();
    await db.bulkInsert(newRecipes);
    this.recipes = newRecipes;
    this.notify();
  }

  async mergeRecipes(incomingRecipes) {
    const existingTitles = new Set(this.recipes.map(r => normalizeText(r.title)));
    const toAdd = [];

    for (const r of incomingRecipes) {
      const normalizedTitle = normalizeText(r.title);
      const recipeToSave = {
        ...r,
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: existingTitles.has(normalizedTitle) ? `${r.title} (Importada)` : r.title,
        createdAt: r.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.save(recipeToSave);
      toAdd.push(recipeToSave);
    }

    this.recipes = [...toAdd, ...this.recipes];
    this.notify();
    return toAdd.length;
  }

  getFilteredRecipes() {
    let list = [...this.recipes];

    // If pantry mode is active and there are ingredients entered
    if (this.filters.pantryMode && this.filters.pantryIngredients.length > 0) {
      list = calculatePantryMatches(list, this.filters.pantryIngredients);
    }

    // Filter by search query (name/title or tags)
    if (this.filters.search.trim()) {
      const query = normalizeText(this.filters.search);
      list = list.filter(r => {
        const titleMatch = normalizeText(r.title).includes(query);
        const tagMatch = r.tags && r.tags.some(t => normalizeText(t).includes(query));
        return titleMatch || tagMatch;
      });
    }

    // Filter by Category
    if (this.filters.category && this.filters.category !== 'todas') {
      list = list.filter(r => r.category.toLowerCase() === this.filters.category.toLowerCase());
    }

    // Filter by Max Time
    if (this.filters.maxTime > 0) {
      list = list.filter(r => Number(r.prepTime) <= this.filters.maxTime);
    }

    // Filter by Only Favorites
    if (this.filters.onlyFavorites) {
      list = list.filter(r => r.favorite);
    }

    return list;
  }
}

export const store = new RecipeStore();
