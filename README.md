# SaborCraft — Gestor de Recetas Inteligente & PWA

**SaborCraft** es una aplicación web moderna orientada a la gestión gastronómica personal, construida con arquitectura **PWA (Progressive Web App)**, base de datos local persistente en **IndexedDB** (con fallback automático a `localStorage`), **escalado dinámico de porciones**, **buscador inteligente por despensa** ("¿Qué tengo en casa?"), y herramientas interactivas de cocina.

---

## Arquitectura del Proyecto y Separación de Responsabilidades

El proyecto implementa el principio de **Separación de Responsabilidades (SoC)** tanto a nivel visual (CSS) como lógico (JavaScript modular ES6).

```
e:\GESTOR_RECETAS/
├── index.html                   # Marcado semántico HTML5, accesibilidad y modales (<dialog>)
├── manifest.webmanifest         # Manifiesto PWA para instalación de escritorio y móvil
├── sw.js                        # Service Worker con caché offline (Stale-while-revalidate)
├── package.json                 # Configuración de proyecto y scripts
├── README.md                    # Documentación técnica y guía de usuario
│
├── icons/                       # Recursos vectoriales y favicons
│   ├── icon.svg                 # Icono principal de alta resolución (SVG)
│   └── favicon.svg              # Favicon optimizado para el navegador
│
├── css/                         # Arquitectura de estilos modular
│   ├── variables.css            # Tokens de diseño, paleta clara/oscura, sombras y transiciones
│   ├── base.css                 # Reset moderno, tipografía, scrollbars y animaciones
│   ├── layout.css               # Estructuras globales (cabecera sticky, barras de control, grilla)
│   └── components.css           # Estilos atómicos y de componentes (cards, modales, chips, temporizador)
│
└── js/                          # Arquitectura JavaScript modular
    ├── app.js                   # Punto de entrada (Bootstrapper y registro PWA)
    ├── db.js                    # Capa de datos persistente (IndexedDB + fallback)
    ├── recipes.js               # Gestor de estado reactivo global (Store centralizado)
    ├── scaler.js                # Lógica matemática de escalado de porciones y formateo
    ├── pantry.js                # Motor de coincidencia de ingredientes de despensa
    ├── export-import.js         # Serialización, descarga y validación de respaldos JSON
    ├── ui.js                    # Orquestador UI (conecta componentes y layout con el Store)
    │
    ├── layout/                  # Responsabilidades de Layout y navegación global
    │   ├── Header.js            # Cabecera sticky, logotipo, modo oscuro/claro, estado offline y botón PWA
    │   └── FiltersBar.js        # Búsqueda en vivo (debounce), tabs de categoría, selector de tiempo y favoritas
    │
    └── components/              # Componentes interactivos reutilizables y desacoplados
        ├── Toast.js             # Sistema de notificaciones flotantes (éxito, error, info)
        ├── RecipeCard.js        # Tarjeta individual (badges, dificultad, favorito, click)
        ├── RecipeDetailModal.js # Modal de detalle, vista de cocción, checklist y escalador
        ├── RecipeFormModal.js   # Modal de creación y edición, filas dinámicas de ingredientes y pasos
        ├── KitchenTimer.js      # Temporizador de cocina con sonido sintetizado (Web Audio API)
        ├── PantryWidget.js      # Widget interactivo de despensa ("¿Qué tengo en casa?")
        └── BackupModal.js       # Modal de copias de seguridad (Exportar e Importar JSON)
```

---

## 🧩 Desglose de Responsabilidades

### 1. Capa de Datos y Estado (`js/`)
- **`db.js`**: Abstrae las operaciones CRUD contra **IndexedDB** (`SaborCraftDB`). Si el navegador restringe IndexedDB (por ejemplo en navegación privada estricta), conmuta automáticamente a `localStorage`.
- **`recipes.js`**: Implementa el patrón *Store* reactivo con suscriptores (`Observer pattern`). Centraliza el estado de las recetas, filtros de búsqueda, categorías, tiempos y favoritas.
- **`scaler.js`**: Parsea cadenas de texto (ej. `"200 g de pechuga"`), calcula el ratio entre comensales base y objetivo (`target / base`), y formatea fracciones legibles (ej. `1 ½`, `¼`).
- **`pantry.js`**: Normaliza nombres de ingredientes (eliminando tildes y mayúsculas) y calcula el porcentaje de preparación posible según lo que hay en la despensa.
- **`export-import.js`**: Genera blobs para descargas `.json` y valida archivos entrantes antes de insertarlos en la base de datos.

### 2. Capa de Layout (`js/layout/`)
- **`Header.js`**:
  - Control del tema Claro / Oscuro con persistencia en `localStorage`.
  - Detección de conectividad en tiempo real (`window.navigator.onLine`).
  - Captura del evento `beforeinstallprompt` para instalar la PWA como app nativa.
- **`FiltersBar.js`**:
  - Manejo de la caja de búsqueda con limpieza rápida y *debounce*.
  - Navegación por píldoras de categorías (Desayunos, Almuerzos, Cenas, etc.).
  - Selectores secundarios de tiempo máximo y filtro de favoritas.

### 3. Capa de Componentes (`js/components/`)
- **`RecipeCard.js`**: Encapsula el ciclo de vida y renderizado de cada tarjeta en la cuadrícula.
- **`RecipeDetailModal.js`**: Maneja el modal nativo `<dialog>`, el escalado interactivo de porciones (`-` / `+`), y el checklist interactivo de ingredientes y pasos de cocina.
- **`KitchenTimer.js`**: Widget autónomo de cuenta atrás con parada, reinicio, configuración personalizada y campanilla acústica sintetizada con la API nativa de Audio del navegador (funciona 100% offline).
- **`RecipeFormModal.js`**: Maneja la adición/eliminación dinámica de filas de ingredientes y pasos, asignación de fotos predeterminadas y validación de campos obligatorios.
- **`PantryWidget.js`**: Despliega el panel de despensa, sugerencias rápidas ("+ Huevos", "+ Tomate"), tags eliminables y botón de vaciado.
- **`BackupModal.js`**: Diálogo para descargar el archivo JSON o restaurar recetas combinando o reemplazando.
- **`Toast.js`**: Proporciona feedback al usuario sin bloquear la pantalla.

---

## Tecnologías y Estándares Web Modernos Utilizados

1. **JavaScript ES6+ Moderno**: Módulos nativos (`import`/`export`), clases y async/await sin necesidad de compiladores pesados.
2. **HTML5 Semántico & Diálogos Nativos**: Uso de `<dialog closedby="any">` con fallback para backdrop dismiss según los estándares modernos.
3. **Vanilla CSS con Sistema de Tokens**:
   - Variables CSS para modo claro y oscuro (`data-theme="light"` / `data-theme="dark"`).
   - Propiedades estándar compatibles (`line-clamp`, `background-clip`).
   - Glassmorphism con `backdrop-filter: blur(...)`.
4. **Almacenamiento Local Robusto**: IndexedDB nativo (sin dependencias externas) con migración y datos iniciales de prueba.
5. **PWA (Progressive Web App)**:
   - Service Worker con soporte offline total.
   - Manifiesto compatible con instalación en Windows, Android, iOS y macOS.
6. **Web Audio API**: Síntesis de ondas sonoras para la alarma del temporizador sin depender de archivos de audio mp3 externos.

---

## 🚀 Puesta en Marcha

### Prerrequisitos
- Node.js instalado (v18 o superior).

### Ejecución Local

```bash
# Iniciar el servidor local en el puerto 3000
npm run dev
# o alternativamente:
npx serve -l 3000 .
```

Abre tu navegador en:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Pruebas Sugeridas en la Aplicación

1. **Creación y Edición (CRUD)**:
   - Haz clic en `+ Nueva Receta`, añade ingredientes con el botón dinámico, selecciona una imagen de ejemplo y guarda.
2. **Escalado de Porciones**:
   - Abre cualquier receta (ej. *Paella Tradicional* o *Pancakes de Avena*).
   - Presiona `+` en el contador de porciones: verás cómo se recalculan inmediatamente los gramos, mililitros y unidades de cada ingrediente.
3. **Despensa ("¿Qué tengo en casa?")**:
   - Haz clic en el botón verde de la despensa.
   - Pulsa sobre los botones rápidos como `+ Huevos` y `+ Tomate`.
   - Observa cómo las tarjetas en la cuadrícula calculan el porcentaje exacto de ingredientes que posees (ej. *100% Listo* o *Faltan 2*).
4. **Temporizador de Cocina**:
   - En la vista de receta, pulsa "Iniciar" en el temporizador o haz clic en los minutos para colocar un temporizador corto (ej. 0.1 minutos) y escuchar la campanilla offline.
5. **Modo Oscuro / Claro**:
   - Pulsa el botón `🌙` / `☀️` en la esquina superior derecha para alternar la paleta de colores.
6. **Respaldo JSON**:
   - Pulsa el icono de sincronización para exportar tu archivo `saborcraft_recetas_*.json` y prueba a restaurarlo o compartirlo.
