/**
 * Database Module (IndexedDB with LocalStorage Fallback)
 */

const DB_NAME = 'SaborCraftDB';
const DB_VERSION = 1;
const STORE_NAME = 'recipes';
const LOCAL_STORAGE_KEY = 'saborcraft_recipes_fallback';

export const INITIAL_RECIPES = [
  {
    id: 'rec_paella_valenciana',
    title: 'Paella Tradicional de Pollo y Verduras',
    category: 'almuerzo',
    prepTime: 50,
    servings: 4,
    difficulty: 'Intermedio',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    tags: ['Arroz', 'Pollo', 'Mediterránea', 'Plato Fuerte'],
    ingredients: [
      { raw: '400 g de arroz bomba', amount: 400, unit: 'g', name: 'arroz bomba' },
      { raw: '500 g de pechuga o muslos de pollo', amount: 500, unit: 'g', name: 'pollo en trozos' },
      { raw: '200 g de judías verdes (bajoqueta)', amount: 200, unit: 'g', name: 'judías verdes' },
      { raw: '2 tomates maduros rallados', amount: 2, unit: 'unidades', name: 'tomates rallados' },
      { raw: '1 litro de caldo de ave', amount: 1, unit: 'litro', name: 'caldo de pollo o ave' },
      { raw: '4 cucharadas de aceite de oliva virgen extra', amount: 4, unit: 'cucharadas', name: 'aceite de oliva' },
      { raw: '1 cucharadita de pimentón dulce', amount: 1, unit: 'cucharadita', name: 'pimentón dulce' },
      { raw: '1 pizca de hebras de azafrán', amount: 1, unit: 'pizca', name: 'azafrán' },
      { raw: '1 pizca de sal y romero fresco', amount: 1, unit: 'pizca', name: 'sal y romero fresco' }
    ],
    steps: [
      'Calienta el aceite en la paella y dora el pollo sazonado a fuego medio-alto hasta que esté bien dorado.',
      'Añade las judías verdes y saltea durante 4 minutos.',
      'Haz un hueco en el centro, agrega el tomate rallado y sofríe hasta reducir el agua. Añade el pimentón con cuidado de que no se queme.',
      'Vierte el arroz y rehógalo durante 1 minuto para nacararlo con los jugos.',
      'Incorpora el caldo caliente junto con el azafrán y una ramita de romero. Distribuye el arroz uniformemente.',
      'Cocina a fuego vivo durante 8 minutos y luego a fuego lento 10 minutos más. Deja reposar 5 minutos tapado antes de servir para lograr un buen socarrat.'
    ],
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z'
  },
  {
    id: 'rec_guacamole_casero',
    title: 'Guacamole Rústico con Totopos',
    category: 'snack',
    prepTime: 15,
    servings: 4,
    difficulty: 'Fácil',
    image: 'https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    tags: ['Mexicana', 'Aguacate', 'Vegano', 'Rápido'],
    ingredients: [
      { raw: '3 aguacates maduros', amount: 3, unit: 'unidades', name: 'aguacates maduros' },
      { raw: '1 tomate mediano picado en cubitos', amount: 1, unit: 'unidad', name: 'tomate' },
      { raw: '0.5 cebolla morada finamente picada', amount: 0.5, unit: 'unidad', name: 'cebolla morada' },
      { raw: '1 chile jalapeño o serrano picado', amount: 1, unit: 'unidad', name: 'chile jalapeño' },
      { raw: '2 limones exprimidos (zumo)', amount: 2, unit: 'unidades', name: 'limones' },
      { raw: '3 cucharadas de cilantro fresco picado', amount: 3, unit: 'cucharadas', name: 'cilantro fresco' },
      { raw: '1 cucharadita de sal marina', amount: 1, unit: 'cucharadita', name: 'sal marina' }
    ],
    steps: [
      'Corta los aguacates por la mitad, retira el hueso y extrae la pulpa con una cuchara en un tazón amplio o molcajete.',
      'Machaca los aguacates con un tenedor manteniendo textura rústica con pequeños trozos.',
      'Añade de inmediato el zumo de limón para conservar el color verde brillante.',
      'Agrega la cebolla morada, el tomate, el chile picado y el cilantro fresco.',
      'Sazona con la sal, mezcla suavemente y ajusta el toque cítrico.',
      'Sirve acompañado de totopos de maíz crujientes recién hechos.'
    ],
    createdAt: '2026-03-02T14:30:00.000Z',
    updatedAt: '2026-03-02T14:30:00.000Z'
  },
  {
    id: 'rec_pancakes_avena',
    title: 'Pancakes Esponjosos de Avena y Plátano',
    category: 'desayuno',
    prepTime: 20,
    servings: 2,
    difficulty: 'Fácil',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    tags: ['Saludable', 'Avena', 'Desayuno Fit', 'Sin Azúcar Añadido'],
    ingredients: [
      { raw: '100 g de copos de avena', amount: 100, unit: 'g', name: 'avena' },
      { raw: '1 plátano maduro', amount: 1, unit: 'unidad', name: 'plátano maduro' },
      { raw: '2 huevos camperos', amount: 2, unit: 'unidades', name: 'huevos' },
      { raw: '60 ml de leche o bebida vegetal', amount: 60, unit: 'ml', name: 'leche' },
      { raw: '1 cucharadita de polvo para hornear', amount: 1, unit: 'cucharadita', name: 'polvo de hornear' },
      { raw: '1 cucharadita de canela en polvo', amount: 1, unit: 'cucharadita', name: 'canela en polvo' },
      { raw: '1 cucharadita de esencia de vainilla', amount: 1, unit: 'cucharadita', name: 'esencia de vainilla' }
    ],
    steps: [
      'Coloca todos los ingredientes en una batidora o procesador de alimentos.',
      'Tritura a potencia alta durante 45 segundos hasta obtener una mezcla suave y homogénea.',
      'Calienta una sartén antiadherente a fuego medio y engrasa ligeramente con una gota de aceite de coco o mantequilla.',
      'Vierte porciones de masa (aproximadamente 3 cucharadas por pancake).',
      'Cocina hasta que aparezcan burbujas en la superficie (unos 2 minutos), dale la vuelta con espátula y cocina 1 minuto más.',
      'Sirve apilados con frutos rojos, nueces y un hilo de miel o jarabe de arce.'
    ],
    createdAt: '2026-03-03T09:15:00.000Z',
    updatedAt: '2026-03-03T09:15:00.000Z'
  },
  {
    id: 'rec_pasta_pesto',
    title: 'Pasta al Pesto Genovés con Piñones',
    category: 'cena',
    prepTime: 25,
    servings: 2,
    difficulty: 'Fácil',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    tags: ['Italiana', 'Pasta', 'Albahaca', 'Vegetariano'],
    ingredients: [
      { raw: '200 g de espaguetis o rigatoni', amount: 200, unit: 'g', name: 'pasta' },
      { raw: '50 g de hojas de albahaca fresca', amount: 50, unit: 'g', name: 'albahaca fresca' },
      { raw: '30 g de piñones o nueces', amount: 30, unit: 'g', name: 'piñones o nueces' },
      { raw: '1 diente de ajo pelado', amount: 1, unit: 'diente', name: 'ajo' },
      { raw: '50 g de queso parmesano rallado', amount: 50, unit: 'g', name: 'queso parmesano' },
      { raw: '75 ml de aceite de oliva virgen extra', amount: 75, unit: 'ml', name: 'aceite de oliva' },
      { raw: '1 pizca de sal gruesa', amount: 1, unit: 'pizca', name: 'sal' }
    ],
    steps: [
      'Hierve agua con abundante sal en una olla grande. Cuece la pasta según las instrucciones del fabricante hasta que esté al dente.',
      'Tuesta ligeramente los piñones en una sartén seca durante 2 minutos para despertar sus aromas.',
      'En un mortero o procesador de alimentos, tritura el diente de ajo con la sal y los piñones.',
      'Agrega las hojas de albahaca bien limpias y secas, triturando con pulsos suaves.',
      'Añade el aceite de oliva en hilo continuo mientras mezclas, y finaliza incorporando el queso parmesano rallado.',
      'Reserva 3 cucharadas del agua de cocción de la pasta. Escurre la pasta, mézclala con el pesto y el agua reservada para una emulsión sedosa.'
    ],
    createdAt: '2026-03-04T18:20:00.000Z',
    updatedAt: '2026-03-04T18:20:00.000Z'
  },
  {
    id: 'rec_brownie_chocolate',
    title: 'Brownie Meloso de Chocolate y Nueces',
    category: 'postre',
    prepTime: 35,
    servings: 6,
    difficulty: 'Fácil',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    tags: ['Chocolate', 'Horno', 'Postres', 'Fudge'],
    ingredients: [
      { raw: '200 g de chocolate negro (70% cacao)', amount: 200, unit: 'g', name: 'chocolate negro' },
      { raw: '110 g de mantequilla sin sal', amount: 110, unit: 'g', name: 'mantequilla' },
      { raw: '120 g de azúcar moreno o panela', amount: 120, unit: 'g', name: 'azúcar' },
      { raw: '3 huevos a temperatura ambiente', amount: 3, unit: 'unidades', name: 'huevos' },
      { raw: '80 g de harina de trigo', amount: 80, unit: 'g', name: 'harina de trigo' },
      { raw: '1 cucharada de cacao puro en polvo', amount: 1, unit: 'cucharada', name: 'cacao puro' },
      { raw: '70 g de nueces picadas', amount: 70, unit: 'g', name: 'nueces' },
      { raw: '1 pizca de sal en escamas', amount: 1, unit: 'pizca', name: 'sal' }
    ],
    steps: [
      'Precalienta el horno a 175°C (350°F) y forra un molde cuadrado de 20 cm con papel de hornear.',
      'Derrite el chocolate negro troceado junto con la mantequilla a baño maría o en el microondas a intervalos cortos de 30 segundos.',
      'En un bol, bate los huevos con el azúcar durante 3 minutos hasta que adquieran una textura espumosa.',
      'Vierte suavemente el chocolate derretido sobre los huevos batiendo constantemente.',
      'Tamiza la harina y el cacao en polvo, integrando con espátula con movimientos envolventes. Añade las nueces.',
      'Vierte en el molde y hornea durante 20-22 minutos. El centro debe quedar húmedo y tembloroso para obtener el toque fudge perfecto.'
    ],
    createdAt: '2026-03-05T16:00:00.000Z',
    updatedAt: '2026-03-05T16:00:00.000Z'
  },
  {
    id: 'rec_limonada_hierbabuena',
    title: 'Limonada Refrescante de Hierbabuena y Jengibre',
    category: 'bebida',
    prepTime: 10,
    servings: 4,
    difficulty: 'Muy Fácil',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    tags: ['Bebidas', 'Cítrico', 'Refrescante', 'Sin Alcohol'],
    ingredients: [
      { raw: '4 limones grandes', amount: 4, unit: 'unidades', name: 'limones' },
      { raw: '1 litro de agua mineral con o sin gas', amount: 1, unit: 'litro', name: 'agua mineral' },
      { raw: '12 hojas de hierbabuena fresca', amount: 12, unit: 'unidades', name: 'hierbabuena' },
      { raw: '1 trozo pequeño de jengibre fresco rallado', amount: 1, unit: 'trozo', name: 'jengibre' },
      { raw: '3 cucharadas de miel o sirope de agave', amount: 3, unit: 'cucharadas', name: 'miel o agave' },
      { raw: '2 tazas de cubitos de hielo', amount: 2, unit: 'tazas', name: 'hielo' }
    ],
    steps: [
      'Exprime los limones para obtener el zumo fresco, colándolo para retirar semillas.',
      'En una jarra grande, machaca suavemente las hojas de hierbabuena con la miel y el jengibre rallado.',
      'Añade el zumo de limón y mezcla bien para disolver el endulzante.',
      'Agrega el agua fría y los cubitos de hielo.',
      'Remueve con una cuchara larga y sirve con rodajas de limón y ramas de hierbabuena decorativas.'
    ],
    createdAt: '2026-03-06T11:00:00.000Z',
    updatedAt: '2026-03-06T11:00:00.000Z'
  }
];

class RecipeDatabase {
  constructor() {
    this.db = null;
    this.useLocalStorage = false;
  }

  async init() {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB no soportado en este entorno. Usando localStorage como fallback.');
      this.useLocalStorage = true;
      this._seedLocalStorageIfEmpty();
      return;
    }

    try {
      this.db = await new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('category', 'category', { unique: false });
            store.createIndex('favorite', 'favorite', { unique: false });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Check if store is empty, seed initial recipes
      const count = await this.count();
      if (count === 0) {
        await this.bulkInsert(INITIAL_RECIPES);
      }
    } catch (err) {
      console.warn('Error al iniciar IndexedDB, activando localStorage:', err);
      this.useLocalStorage = true;
      this._seedLocalStorageIfEmpty();
    }
  }

  _seedLocalStorageIfEmpty() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RECIPES));
    }
  }

  async count() {
    if (this.useLocalStorage) {
      const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      return data.length;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll() {
    if (this.useLocalStorage) {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getById(id) {
    if (this.useLocalStorage) {
      const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      return all.find(r => r.id === id) || null;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async save(recipe) {
    const item = {
      ...recipe,
      id: recipe.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      updatedAt: new Date().toISOString()
    };
    if (!item.createdAt) {
      item.createdAt = item.updatedAt;
    }

    if (this.useLocalStorage) {
      const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const index = all.findIndex(r => r.id === item.id);
      if (index >= 0) {
        all[index] = item;
      } else {
        all.unshift(item);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
      return item;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id) {
    if (this.useLocalStorage) {
      const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const filtered = all.filter(r => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async clear() {
    if (this.useLocalStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return true;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async bulkInsert(recipes) {
    if (this.useLocalStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
      return recipes;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      recipes.forEach(r => store.put(r));
      transaction.oncomplete = () => resolve(recipes);
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const db = new RecipeDatabase();
