# 01 - Arquitectura del Sistema y Flujo de Datos

## 1. Visión General
**MiDespensa** está diseñado bajo los principios de **Separación de Responsabilidades (SoC)**, **Alta Cohesión** y **Bajo Acoplamiento**. No utiliza frameworks monolíticos pesados; en su lugar, implementa una arquitectura modular limpia utilizando JavaScript moderno (ES6+ Modules) y estándares web nativos.

---

## 2. Diagrama de Capas del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE PRESENTACIÓN (UI)                   │
│                                                             │
│   Layout (Estructuras Globales)                             │
│   ├── Header.js          (Branding, PWA, Red, Tema)         │
│   └── FiltersBar.js      (Búsqueda, Pestañas, Tiempos)      │
│                                                             │
│   Componentes Autónomos                                     │
│   ├── RecipeCard.js        (Renderizado de tarjeta)         │
│   ├── RecipeDetailModal.js (Vista de cocción y escalador)   │
│   ├── RecipeFormModal.js   (Editor dinámico de recetas)     │
│   ├── KitchenTimer.js      (Temporizador con audio nativo)  │
│   ├── PantryWidget.js      (Gestor de despensa)             │
│   ├── BackupModal.js       (Importador/Exportador JSON)     │
│   ├── Toast.js             (Notificaciones flotantes)       │
│   └── Icons.js             (Iconografía vectorial SVG)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Eventos del usuario
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               CAPA DE ORQUESTACIÓN (ui.js)                  │
│   Coordina la instanciación de Layout y Componentes y       │
│   se suscribe a los cambios del Store.                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Suscripción reactiva (Observer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             CAPA DE ESTADO REACTIVO (recipes.js)            │
│   - Catálogo de recetas                                     │
│   - Estado de filtros activos                               │
│   - Ingredientes de despensa                                │
│   - Despacho de notificaciones a suscriptores               │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│   LÓGICA DE NEGOCIO PURA    │ │     CAPA DE PERSISTENCIA    │
│                             │ │                             │
│ - scaler.js                 │ │ - db.js                     │
│   (Cálculo proporcional y   │ │   Almacén IndexedDB con     │
│    fracciones legibles)     │ │   índices y fallback        │
│                             │ │   automático a localStorage │
│ - pantry.js                 │ │                             │
│   (Motor de coincidencia de │ │ - export-import.js          │
│    ingredientes y ranking)  │ │   (Serialización y          │
│                             │ │    validación de esquemas)  │
└─────────────────────────────┘ └─────────────────────────────┘
               ▲                               ▲
               └───────────────┬───────────────┘
                               │ Caching y soporte offline
┌──────────────────────────────┴──────────────────────────────┐
│                  CAPA OFFLINE / RED (PWA)                   │
│  sw.js (Service Worker con Stale-While-Revalidate)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Flujo Unidireccional de Datos (Unidirectional Data Flow)

1. **Acción del Usuario**: El usuario interactúa con la vista (ej. pulsa el botón de favoritos, filtra por "Desayuno", o añade un ingrediente a la despensa).
2. **Mutación en el Store**: El componente o layout invoca el método correspondiente en `recipes.js` (ej. `store.toggleFavorite(id)` o `store.addPantryIngredient('Huevo')`).
3. **Persistencia Automática**: El Store delega a `db.js` para persistir la mutación de forma asíncrona en **IndexedDB**.
4. **Notificación a Suscriptores**: El Store ejecuta `this.notify()`, invocando a todos los escuchadores registrados.
5. **Re-renderizado Eficiente**: El orquestador `ui.js` recibe la notificación, obtiene la lista calculada con `store.getFilteredRecipes()` y actualiza el DOM de forma reactiva.

---

## 4. Desacoplamiento entre Componentes
Ningún componente visual conoce los detalles internos de otro componente:
- `KitchenTimer.js` desconoce si está dentro de un modal o en una página completa; solo necesita un contenedor donde montarse (`attach(container)`).
- `RecipeCard.js` desconoce la existencia de `RecipeDetailModal.js`; cuando el usuario hace clic en una tarjeta, emite un callback `onSelect(recipeId)` que es manejado por el orquestador.
- `PantryWidget.js` no renderiza las recetas; solo modifica el estado de la despensa en el Store, y la cuadrícula reacciona automáticamente.
