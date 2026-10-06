/**
 * Pantry Matching Module
 * Helps users find what they can cook with ingredients already at home.
 */

import { normalizeText } from './scaler.js';

export const POPULAR_PANTRY_INGREDIENTS = [
  'Huevos',
  'Pollo',
  'Tomate',
  'Cebolla',
  'Ajo',
  'Arroz',
  'Pasta',
  'Queso',
  'Leche',
  'Patatas',
  'Aceite de oliva',
  'Harina',
  'Aguacate',
  'Limón',
  'Chocolate',
  'Avena',
  'Albahaca',
  'Mantequilla'
];

/**
 * Checks if a recipe ingredient matches any of user's pantry ingredients
 */
function isIngredientMatched(ingredient, userIngredientsNormalized) {
  const ingName = normalizeText(ingredient.name || ingredient.raw || '');
  if (!ingName) return false;

  return userIngredientsNormalized.some(userItem => {
    if (!userItem) return false;
    // Direct token match or substring match
    return ingName.includes(userItem) || userItem.includes(ingName);
  });
}

/**
 * Computes pantry match results for all recipes
 * Returns list of recipes augmented with pantry match details:
 * {
 *   ...recipe,
 *   matchCount,
 *   totalIngredients,
 *   matchPercentage,
 *   matchedIngredients: [...],
 *   missingIngredients: [...]
 * }
 */
export function calculatePantryMatches(recipes, userPantryIngredients) {
  if (!userPantryIngredients || userPantryIngredients.length === 0) {
    return recipes.map(r => ({
      ...r,
      matchCount: 0,
      totalIngredients: r.ingredients ? r.ingredients.length : 0,
      matchPercentage: 0,
      matchedIngredients: [],
      missingIngredients: r.ingredients || []
    }));
  }

  const userItemsNormalized = userPantryIngredients
    .map(normalizeText)
    .filter(Boolean);

  const scoredRecipes = recipes.map(recipe => {
    const ingredients = recipe.ingredients || [];
    const totalIngredients = ingredients.length;

    if (totalIngredients === 0) {
      return {
        ...recipe,
        matchCount: 0,
        totalIngredients: 0,
        matchPercentage: 0,
        matchedIngredients: [],
        missingIngredients: []
      };
    }

    const matchedIngredients = [];
    const missingIngredients = [];

    ingredients.forEach(ing => {
      if (isIngredientMatched(ing, userItemsNormalized)) {
        matchedIngredients.push(ing);
      } else {
        missingIngredients.push(ing);
      }
    });

    const matchCount = matchedIngredients.length;
    const matchPercentage = Math.round((matchCount / totalIngredients) * 100);

    return {
      ...recipe,
      matchCount,
      totalIngredients,
      matchPercentage,
      matchedIngredients,
      missingIngredients
    };
  });

  // Sort descending by match percentage, then by title
  return scoredRecipes.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.title.localeCompare(b.title);
  });
}
