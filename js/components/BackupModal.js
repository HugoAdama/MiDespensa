/**
 * Component: BackupModal
 * Responsibility: Manages JSON export and import backup modal workflows.
 */

import { store } from '../recipes.js';
import { exportRecipesToJSON, parseRecipesFromJSONFile } from '../export-import.js';
import { toast } from './Toast.js';

export class BackupModal {
  constructor() {
    this.modal = document.getElementById('backupModal');
    this.openBtn = document.getElementById('openBackupBtn');
    this.exportBtn = document.getElementById('exportJSONBtn');
    this.fileInput = document.getElementById('importFileInput');
    this.mergeBtn = document.getElementById('importMergeBtn');
    this.replaceBtn = document.getElementById('importReplaceBtn');

    this.setup();
  }

  setup() {
    this.openBtn.onclick = () => this.modal.showModal();

    // Export
    this.exportBtn.onclick = () => {
      try {
        const recipes = store.getRecipes();
        exportRecipesToJSON(recipes);
        toast.success('¡Archivo JSON exportado y descargado con éxito! 📁');
      } catch (err) {
        alert(err.message);
      }
    };

    // Import Merge
    this.mergeBtn.onclick = async () => {
      const file = this.fileInput.files[0];
      if (!file) {
        alert('Por favor, selecciona primero un archivo .json.');
        return;
      }

      try {
        const imported = await parseRecipesFromJSONFile(file);
        const count = await store.mergeRecipes(imported);
        this.modal.close();
        this.fileInput.value = '';
        toast.success(`Se combinaron ${count} recetas exitosamente. ✅`);
      } catch (err) {
        alert(err.message);
      }
    };

    // Import Replace
    this.replaceBtn.onclick = async () => {
      const file = this.fileInput.files[0];
      if (!file) {
        alert('Por favor, selecciona primero un archivo .json.');
        return;
      }

      if (!confirm('⚠️ Esta acción borrará todas las recetas actuales y cargará solo las del archivo seleccionado. ¿Deseas continuar?')) {
        return;
      }

      try {
        const imported = await parseRecipesFromJSONFile(file);
        await store.replaceAll(imported);
        this.modal.close();
        this.fileInput.value = '';
        toast.success(`Se importaron ${imported.length} recetas en reemplazo total. ✅`);
      } catch (err) {
        alert(err.message);
      }
    };
  }
}
