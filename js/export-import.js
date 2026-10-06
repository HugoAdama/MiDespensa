/**
 * Export and Import Module
 * Manages JSON backup and restore with structure validation.
 */

/**
 * Validates whether an imported object has valid recipe structure
 */
export function isValidRecipe(obj) {
  if (!obj || typeof obj !== 'object') return false;
  if (!obj.title || typeof obj.title !== 'string') return false;
  if (!Array.isArray(obj.ingredients)) return false;
  if (!Array.isArray(obj.steps)) return false;
  return true;
}

/**
 * Triggers a download of recipes as a JSON file
 */
export function exportRecipesToJSON(recipes) {
  if (!recipes || recipes.length === 0) {
    throw new Error('No hay recetas para exportar.');
  }

  const exportData = {
    app: 'SaborCraft',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalRecipes: recipes.length,
    recipes: recipes
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `saborcraft_recetas_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads a File object and parses it as recipes JSON
 */
export async function parseRecipesFromJSONFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Ningún archivo seleccionado.'));
      return;
    }

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      reject(new Error('El archivo debe tener formato .json'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        let recipesArray = [];

        if (Array.isArray(parsed)) {
          recipesArray = parsed;
        } else if (parsed && Array.isArray(parsed.recipes)) {
          recipesArray = parsed.recipes;
        } else {
          throw new Error('El formato JSON no contiene una lista de recetas válida.');
        }

        const validRecipes = recipesArray.filter(isValidRecipe);

        if (validRecipes.length === 0) {
          throw new Error('No se encontraron recetas con formato válido en el archivo.');
        }

        resolve(validRecipes);
      } catch (err) {
        reject(new Error('Error al procesar el archivo JSON: ' + err.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo en el navegador.'));
    };

    reader.readAsText(file);
  });
}
