# MiDespensa — Gestor de Recetas Inteligente y PWA

**MiDespensa** es una aplicación web moderna orientada a la gestión gastronómica personal, construida con arquitectura **PWA (Progressive Web App)**, base de datos local persistente en **IndexedDB** (con fallback automático a `localStorage`), **escalado dinámico de porciones**, **buscador inteligente por despensa** ("¿Qué tengo en casa?"), y herramientas interactivas de cocina.

---

## Documentación Técnica Detallada (`docs/`)

Para una lectura profunda y especializada, consulta la carpeta de documentación dedicada:

| Documento | Descripción |
| :--- | :--- |
| **[01 - Arquitectura del Sistema](docs/01_ARQUITECTURA_DEL_SISTEMA.md)** | Diagrama de capas, flujo unidireccional de datos y desacoplamiento. |
| **[02 - Arquitectura CSS y Diseño](docs/02_ARQUITECTURA_CSS_Y_DISEÑO.md)** | Metodología modular de estilos (Tokens, Base, Layout y Componentes). |
| **[03 - Tecnologías y Estándares](docs/03_TECNOLOGIAS_Y_ESTANDARES.md)** | IndexedDB vs LocalStorage, Service Worker PWA, Web Audio API y `<dialog>`. |
| **[04 - Aprendizajes y Conclusiones](docs/04_APRENDIZAJES_Y_CONCLUSIONES.md)** | Lecciones aprendidas, arquitectura sin compiladores pesados y resiliencia. |
| **[05 - Guía de Uso y Pruebas](docs/05_GUIA_DE_USO_Y_PRUEBAS.md)** | Casos de prueba paso a paso para evaluar el CRUD, escalador y modo offline. |

---

## Árbol del Proyecto y Separación de Responsabilidades

El proyecto implementa una separación estricta de responsabilidades (SoC) en todas sus capas:

```
e:\GESTOR_RECETAS/
├── index.html                   # Marcado semántico HTML5 y modales nativos (<dialog>)
├── manifest.webmanifest         # Manifiesto PWA para instalación de escritorio y móvil
├── sw.js                        # Service Worker con caché offline (Stale-while-revalidate)
├── package.json                 # Configuración de proyecto y scripts
├── README.md                    # Índice general y guía rápida
│
├── docs/                        # Carpeta propia de documentación técnica
│   ├── 01_ARQUITECTURA_DEL_SISTEMA.md
│   ├── 02_ARQUITECTURA_CSS_Y_DISEÑO.md
│   ├── 03_TECNOLOGIAS_Y_ESTANDARES.md
│   ├── 04_APRENDIZAJES_Y_CONCLUSIONES.md
│   └── 05_GUIA_DE_USO_Y_PRUEBAS.md
│
├── icons/                       # Recursos vectoriales y favicons
│   ├── icon.svg                 # Icono principal de alta resolución (SVG)
│   └── favicon.svg              # Favicon optimizado para el navegador
│
├── css/                         # Arquitectura CSS modular
│   ├── variables.css            # Tokens de diseño y variables temáticas (claro/oscuro)
│   ├── base.css                 # Reset moderno, tipografía base y animaciones
│   ├── main.css                 # Manifiesto maestro que importa todas las capas
│   │
│   ├── layout/                  # Responsabilidad: Estructuras macro y contenedores
│   │   ├── header.css           # Cabecera fija (sticky), branding y acciones
│   │   ├── filters.css          # Buscador reactivo, píldoras y selectores de tiempo
│   │   └── grid.css             # Contenedor, cuadrícula responsive y botón flotante móvil (FAB)
│   │
│   └── components/              # Responsabilidad: Componentes atómicos e interactivos
│       ├── buttons.css          # Variantes de botones, píldoras y botones de icono
│       ├── cards.css            # Tarjetas de receta, portadas y badges de categoría
│       ├── dialogs.css          # Modales nativos (<dialog>) y efecto backdrop blur
│       ├── forms.css            # Inputs, selects y filas dinámicas del editor
│       ├── scaler.css           # Stepper de escalado de porciones y checklist interactivo
│       ├── timer.css            # Temporizador culinario y display digital monoespaciado
│       ├── pantry.css           # Banner de despensa, chips removibles y sugerencias
│       └── toasts.css           # Alertas toast flotantes y badge de conexión a internet
│
└── js/                          # Arquitectura JavaScript modular (ES6+)
    ├── app.js                   # Bootstrapper y registro del Service Worker
    ├── db.js                    # Capa IndexedDB con índices y fallback a localStorage
    ├── recipes.js               # Store reactivo con patrón Observer
    ├── scaler.js                # Parser sintáctico y cálculo de porciones con fracciones
    ├── pantry.js                # Algoritmo de coincidencia lingüística para la despensa
    ├── export-import.js         # Serialización y validación de copias de seguridad JSON
    ├── ui.js                    # Orquestador UI (conecta componentes y layout con el Store)
    │
    ├── layout/                  # Controladores de Layout
    │   ├── Header.js            # Encabezado, conmutador de tema, detector de red y PWA
    │   └── FiltersBar.js        # Búsqueda en vivo (debounce), tabs y filtros secundarios
    │
    └── components/              # Componentes interactivos
        ├── Icons.js             # Diccionario centralizado de vectores SVG
        ├── Toast.js             # Notificaciones no invasivas
        ├── RecipeCard.js        # Renderizado atómico de tarjetas
        ├── RecipeDetailModal.js # Modal de detalle, vista de cocción y checklist
        ├── RecipeFormModal.js   # Creador/editor con filas dinámicas
        ├── KitchenTimer.js      # Temporizador de cocina con síntesis Web Audio API
        ├── PantryWidget.js      # Interfaz interactiva de despensa
        └── BackupModal.js       # Gestor de exportación/importación JSON
```

---

## Inicio Rápido

### Prerrequisitos
- Node.js instalado (v18 o superior).

### Ejecución Local

```bash
# Iniciar el servidor local en el puerto 3000
npm run dev
# o bien:
npx serve -l 3000 .
```

Abre tu navegador en:
**[http://localhost:3000](http://localhost:3000)**
