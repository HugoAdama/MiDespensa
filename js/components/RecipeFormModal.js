/**
 * Component: RecipeFormModal
 * Responsibility: Manages the Recipe Creation and Editing form modal, dynamic fields, and presets.
 */

import { store } from '../recipes.js';
import { toast } from './Toast.js';

const PRESET_IMAGES = [
  { name: 'Paella / Arroz', url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tacos / Mex', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pasta Italiana', url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pancakes / Avena', url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ensalada Fresca', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { name: 'Brownie / Chocolate', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bebida / Fruta', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
];

export class RecipeFormModal {
  constructor({ onSaved }) {
    this.modal = document.getElementById('recipeFormModal');
    this.form = document.getElementById('recipeForm');
    this.titleEl = document.getElementById('formModalTitle');
    this.idInput = document.getElementById('formRecipeId');
    this.titleInput = document.getElementById('formTitle');
    this.categorySelect = document.getElementById('formCategory');
    this.prepTimeInput = document.getElementById('formPrepTime');
    this.servingsInput = document.getElementById('formServings');
    this.difficultySelect = document.getElementById('formDifficulty');
    this.imageInput = document.getElementById('formImage');
    this.tagsInput = document.getElementById('formTags');
    this.ingContainer = document.getElementById('ingredientsEditorContainer');
    this.stepsContainer = document.getElementById('stepsEditorContainer');
    this.onSaved = onSaved;

    this.setupEvents();
  }

  setupEvents() {
    // Preset images
    const presetContainer = document.getElementById('presetImagesList');
    if (presetContainer) {
      presetContainer.innerHTML = '';
      PRESET_IMAGES.forEach(preset => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-pill';
        btn.style.fontSize = '0.75rem';
        btn.style.padding = '0.2rem 0.5rem';
        btn.textContent = preset.name;
        btn.onclick = () => {
          this.imageInput.value = preset.url;
        };
        presetContainer.appendChild(btn);
      });
    }

    // Dynamic row buttons
    document.getElementById('addIngredientRowBtn').onclick = () => {
      this.addIngredientRow();
    };

    document.getElementById('addStepRowBtn').onclick = () => {
      this.addStepRow();
    };

    // Form submit
    this.form.onsubmit = async (e) => {
      e.preventDefault();
      await this.save();
    };
  }

  open(recipeId = null) {
    this.ingContainer.innerHTML = '';
    this.stepsContainer.innerHTML = '';

    if (recipeId) {
      const recipe = store.getRecipeById(recipeId);
      if (!recipe) return;

      this.titleEl.textContent = 'Editar Receta';
      this.idInput.value = recipe.id;
      this.titleInput.value = recipe.title;
      this.categorySelect.value = recipe.category;
      this.prepTimeInput.value = recipe.prepTime;
      this.servingsInput.value = recipe.servings || 4;
      this.difficultySelect.value = recipe.difficulty || 'Intermedio';
      this.imageInput.value = recipe.image || '';
      this.tagsInput.value = (recipe.tags || []).join(', ');

      if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ing => {
          this.addIngredientRow(ing.amount ?? '', ing.unit ?? '', ing.name ?? ing.raw ?? '');
        });
      } else {
        this.addIngredientRow();
      }

      if (recipe.steps && recipe.steps.length > 0) {
        recipe.steps.forEach(step => {
          this.addStepRow(step);
        });
      } else {
        this.addStepRow();
      }
    } else {
      this.titleEl.textContent = 'Nueva Receta';
      this.idInput.value = '';
      this.titleInput.value = '';
      this.categorySelect.value = 'almuerzo';
      this.prepTimeInput.value = 30;
      this.servingsInput.value = 4;
      this.difficultySelect.value = 'Intermedio';
      this.imageInput.value = '';
      this.tagsInput.value = '';

      this.addIngredientRow();
      this.addIngredientRow();
      this.addStepRow();
      this.addStepRow();
    }

    this.modal.showModal();
  }

  close() {
    this.modal.close();
  }

  addIngredientRow(amount = '', unit = '', name = '') {
    const row = document.createElement('div');
    row.className = 'ingredient-edit-row';

    row.innerHTML = `
      <input type="number" step="any" min="0" placeholder="Cant." class="form-input ing-amount" style="width: 85px;" value="${amount}">
      <input type="text" placeholder="Unidad (g, ml, taza...)" class="form-input ing-unit" style="width: 140px;" value="${unit}">
      <input type="text" placeholder="Nombre del ingrediente (ej. pechuga de pollo) *" class="form-input ing-name" style="flex: 1;" value="${name}" required>
      <button type="button" class="btn-icon btn-danger remove-row-btn" title="Eliminar fila" style="width: 36px; height: 36px; font-size: 0.9rem;">✕</button>
    `;

    row.querySelector('.remove-row-btn').onclick = () => {
      if (this.ingContainer.children.length > 1) {
        row.remove();
      } else {
        alert('Una receta debe tener al menos un ingrediente.');
      }
    };

    this.ingContainer.appendChild(row);
  }

  addStepRow(text = '') {
    const row = document.createElement('div');
    row.className = 'ingredient-edit-row';
    const stepNum = this.stepsContainer.children.length + 1;

    row.innerHTML = `
      <span class="step-num" style="width: 28px; height: 28px; font-size: 0.8rem;">${stepNum}</span>
      <textarea class="form-textarea step-text" rows="2" placeholder="Describe este paso de la preparación..." style="flex: 1;" required>${text}</textarea>
      <button type="button" class="btn-icon btn-danger remove-row-btn" title="Eliminar paso" style="width: 36px; height: 36px; font-size: 0.9rem;">✕</button>
    `;

    row.querySelector('.remove-row-btn').onclick = () => {
      if (this.stepsContainer.children.length > 1) {
        row.remove();
        this.renumberSteps();
      } else {
        alert('Una receta debe tener al menos un paso.');
      }
    };

    this.stepsContainer.appendChild(row);
  }

  renumberSteps() {
    Array.from(this.stepsContainer.children).forEach((row, idx) => {
      const numSpan = row.querySelector('.step-num');
      if (numSpan) numSpan.textContent = idx + 1;
    });
  }

  async save() {
    const id = this.idInput.value.trim();
    const title = this.titleInput.value.trim();
    const category = this.categorySelect.value;
    const prepTime = Number(this.prepTimeInput.value);
    const servings = Number(this.servingsInput.value);
    const difficulty = this.difficultySelect.value;
    const image = this.imageInput.value.trim();
    const tags = this.tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const ingRows = this.ingContainer.querySelectorAll('.ingredient-edit-row');
    const ingredients = [];
    ingRows.forEach(row => {
      const amountVal = row.querySelector('.ing-amount').value.trim();
      const unitVal = row.querySelector('.ing-unit').value.trim();
      const nameVal = row.querySelector('.ing-name').value.trim();

      if (nameVal) {
        const amount = amountVal !== '' ? parseFloat(amountVal) : null;
        let rawStr = '';
        if (amount !== null) rawStr += `${amount} `;
        if (unitVal) rawStr += `${unitVal} `;
        rawStr += `de ${nameVal}`.replace(/\s+/g, ' ');

        ingredients.push({
          raw: rawStr.trim(),
          amount: amount,
          unit: unitVal,
          name: nameVal
        });
      }
    });

    const stepRows = this.stepsContainer.querySelectorAll('.ingredient-edit-row');
    const steps = [];
    stepRows.forEach(row => {
      const text = row.querySelector('.step-text').value.trim();
      if (text) steps.push(text);
    });

    if (ingredients.length === 0) {
      alert('Debes agregar al menos un ingrediente válido.');
      return;
    }

    if (steps.length === 0) {
      alert('Debes agregar al menos un paso de preparación.');
      return;
    }

    const data = {
      title,
      category,
      prepTime,
      servings,
      difficulty,
      image,
      tags,
      ingredients,
      steps
    };

    if (id) {
      await store.updateRecipe(id, data);
      toast.success('Receta actualizada con éxito.');
    } else {
      await store.addRecipe(data);
      toast.success('Nueva receta creada con éxito.');
    }

    this.close();
    if (this.onSaved) this.onSaved();
  }
}
