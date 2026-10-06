# Documento Técnico: Arquitectura, Tecnologías y Aprendizajes del Proyecto

## 1. Introducción y Propósito del Proyecto

El proyecto **SaborCraft (Gestor de Recetas Inteligente)** fue concebido como una aplicación web integral diseñada para resolver un problema cotidiano: organizar un recetario personal, cocinar con lo que se tiene en casa y ajustar cantidades según los comensales, todo funcionando con independencia de la conexión a internet.

El reto técnico consistió en demostrar dominio integral de:
- **CRUD y Formularios Dinámicos**: Creación, lectura, actualización y eliminación de estructuras de datos complejas (recetas con listas dinámicas de ingredientes y pasos).
- **Lógica de Estado y Modularidad**: Gestión del flujo de datos desacoplada de la interfaz gráfica.
- **Persistencia Avanzada**: Implementación de una base de datos local mediante **IndexedDB** con tolerancia a fallos.
- **Capacidades Offline y PWA**: Funcionamiento 100% desconectado mediante Service Worker y Web App Manifest.
- **Diseño y Experiencia de Usuario (UX)**: Interfaz responsiva, temas claro/oscuro y componentes visuales basados en estándares modernos.

---

## 2. Arquitectura de Software y Separación de Responsabilidades

El software adopta el principio de **Separación de Responsabilidades (Separation of Concerns - SoC)** para evitar código monolítico ("código espagueti") y garantizar que cada archivo tenga una única razón para cambiar.

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE PRESENTACIÓN (UI)                   │
│  ┌─────────────────────────┐   ┌─────────────────────────┐  │
│  │   Layout (Estructura)   │   │ Componentes Autónomos   │  │
│  │  - Header.js            │   │  - RecipeCard.js        │  │
│  │  - FiltersBar.js        │   │  - RecipeDetailModal.js │  │
│  └─────────────────────────┘   │  - RecipeFormModal.js   │  │
│                                │  - KitchenTimer.js      │  │
│                                │  - PantryWidget.js      │  │
│                                │  - BackupModal.js       │  │
│                                │  - Toast.js             │  │
│                                └─────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Eventos / Renders
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ORQUESTADOR DE INTERFAZ                     │
│  ui.js (Conecta eventos del DOM con el Store reactivo)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Suscripciones / Notificaciones
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               CAPA DE ESTADO REACTIVO (STORE)               │
│  recipes.js (Almacena lista, filtros, despensa y favoritos) │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│   LÓGICA DE NEGOCIO PURA    │ │     CAPA DE PERSISTENCIA    │
│ - scaler.js (escalado mat.) │ │ - db.js                     │
│ - pantry.js (matching alg.) │ │   IndexedDB (ObjectStore)   │
│ - export-import.js (JSON)   │ │   Fallback a localStorage   │
└─────────────────────────────┘ └─────────────────────────────┘
               ▲                               ▲
               └───────────────┬───────────────┘
                               │ Caché de activos estáticos
┌──────────────────────────────┴──────────────────────────────┐
│                  CAPA OFFLINE / RED (PWA)                   │
│  sw.js (Service Worker con Stale-While-Revalidate)          │
└─────────────────────────────────────────────────────────────┘
```

### Detalle de Módulos

#### A. Capa de Layout (`js/layout/`)
Responsable de los contenedores globales y la navegación de la aplicación:
- **`Header.js`**: Administra la barra de encabezado superior fija (*sticky*), el logotipo con función de restablecimiento rápido, el conmutador de tema Claro/Oscuro, el detector del estado de conexión a internet (`online`/`offline`) y el interceptor del evento de instalación nativa de la PWA.
- **`FiltersBar.js`**: Gestiona los controles de búsqueda en tiempo real (con técnica de *debounce* para optimizar rendimiento), la barra de pestañas de categorías, el selector de tiempo máximo de cocción y el filtro de recetas favoritas.

#### B. Capa de Componentes (`js/components/`)
Módulos reutilizables, independientes y con bajo acoplamiento:
- **`RecipeCard.js`**: Construcción atómica de las tarjetas en la cuadrícula principal, gestión del botón de favoritos y cálculo visual del badge de coincidencia de despensa.
- **`RecipeDetailModal.js`**: Modal nativo `<dialog>` para visualizar la receta, coordinar el escalador numérico de porciones y habilitar la lista interactiva de verificación de ingredientes y pasos durante la preparación.
- **`RecipeFormModal.js`**: Formulario interactivo que permite añadir y suprimir filas dinámicas de ingredientes y pasos con renumeración automática y validación de campos.
- **`KitchenTimer.js`**: Widget autónomo de temporizador culinario con cuenta atrás interactiva y alerta sonora generada mediante la Web Audio API.
- **`PantryWidget.js`**: Interfaz desplegable de "¿Qué tengo en casa?", con catálogo de sugerencias en un clic y etiquetas eliminables.
- **`BackupModal.js`**: Gestor de respaldo para exportar el catálogo completo en formato JSON o importar archivos con opciones de fusión o sobrescritura.
- **`Toast.js`**: Notificaciones visuales flotantes y temporizadas para retroalimentación no invasiva al usuario.
- **`Icons.js`**: Diccionario centralizado de vectores SVG limpios y consistentes, eliminando el uso de emojis informales en la interfaz.

---

## 3. Tecnologías y Estándares Web Modernos Utilizados

### 1. HTML5 Semántico y Elementos `<dialog>` Nativos
En lugar de librerías externas de modales pesadas, se utilizó el elemento nativo `<dialog>`. 
- Incorpora soporte para el atributo moderno `closedby="any"` (especificación web moderna para cerrar al hacer clic en el backdrop o con la tecla `Esc`).
- Se implementó un algoritmo de respaldo (*fallback*) que calcula las coordenadas del rectángulo del modal (`getBoundingClientRect()`), permitiendo compatibilidad universal en todos los navegadores.

### 2. Vanilla CSS con Sistema de Tokens (Sin Frameworks)
- **Variables CSS (`:root` y `[data-theme="dark"]`)**: Centralización de colores temáticos, radios de borde, sombras y curvas de animación (`cubic-bezier`).
- **Compatibilidad de propiedades estándar**: Implementación correcta de `line-clamp: 2;` y `background-clip: text;` junto a sus prefijos de proveedor correspondientes.
- **Efectos modernos**: Uso de *Glassmorphism* (`backdrop-filter: blur(...)`) para cabeceras y modales.

### 3. JavaScript Modular Moderno (ES6+ Modules)
- Arquitectura *buildless*: No requiere herramientas de compilación complejas (Webpack, Vite o Babel) para su ejecución en navegadores modernos.
- Código limpio basado en clases, funciones asíncronas (`async`/`await`), desestructuración y promesas.

### 4. Persistencia con IndexedDB
- Mientras que `localStorage` está limitado a ~5MB y es síncrono y bloqueante, **IndexedDB** es una base de datos indexada orientada a objetos, transaccional y asíncrona.
- Almacén de objetos (`ObjectStore`) configurado con índices para búsquedas eficientes por categoría, título, fecha de actualización y estado de favorito.
- Se implementó un mecanismo de *fallback* automático hacia `localStorage` en caso de que las políticas de seguridad del navegador restrinjan el acceso a IndexedDB.

### 5. Progressive Web App (PWA) y Service Worker
- **Estrategia Stale-While-Revalidate**: El Service Worker (`sw.js`) sirve inmediatamente los recursos desde la caché local garantizando carga instantánea sin red, mientras actualiza la copia en caché en segundo plano.
- **Instalación autónoma**: Definición en `manifest.webmanifest` con iconos SVG vectoriales escalables que permiten ejecutar la aplicación como app nativa de escritorio o móvil sin barra de direcciones del navegador.

### 6. Web Audio API (Alarma Sonora Offline)
Para la campana del temporizador culinario, en lugar de descargar un archivo MP3 pesado que podría fallar sin conexión, se utilizó síntesis acústica en tiempo real con osciladores sinusoidales (`OscillatorNode`) y rampas de decaimiento de ganancia (`GainNode`), produciendo acordes agradables y nítidos con cero kilobytes de consumo de red.

---

## 4. Algoritmos y Lógica de Negocio Destacada

### A. Parser y Escalador Inteligente de Ingredientes (`scaler.js`)
Permite pasar de una receta para 2 personas a 4, 6 u 8 personas recalculando cantidades automáticamente:
1. **Detección sintáctica**: Un motor de expresiones regulares separa la cantidad (enteros, decimales o fracciones como `"1 1/2"`), la unidad de medida (`g`, `ml`, `taza`, `cucharada`, etc.) y el nombre del ingrediente.
2. **Cálculo de proporción**: Se calcula el factor de escala `factor = comensalesObjetivo / comensalesBase`.
3. **Formateo culinario**: Se convierten números decimales a fracciones visualmente legibles (ej. `0.5` a `½`, `0.25` a `¼`, `0.75` a `¾`).

### B. Algoritmo de Coincidencia de Despensa (`pantry.js`)
Permite saber qué cocinar con lo que hay en la nevera:
1. **Normalización lingüística**: Limpieza mediante descomposición canónica (`String.prototype.normalize('NFD')`) eliminando diacríticos/tildes y unificando mayúsculas/minúsculas.
2. **Puntuación por receta**: Compara cada ingrediente requerido contra el conjunto de ingredientes ingresados por el usuario.
3. **Clasificación**: Ordena el catálogo de recetas de forma descendente por porcentaje de viabilidad (`matchPercentage`), destacando recetas al 100% o indicando cuántos ingredientes faltan.

---

## 5. Qué Aprendimos (Lecciones y Conclusiones Técnicas)

1. **La web nativa moderna no necesita dependencias gigantescas**:
   Con HTML5 semántico, CSS moderno y JavaScript modular es posible desarrollar interfaces de nivel profesional, rápidas y ligeras sin incurrir en la sobrecarga de dependencias de terceros.

2. **La persistencia offline requiere arquitectura resiliente**:
   Aprender a implementar **IndexedDB** con transacciones y prever fallbacks a `localStorage` demostró cómo manejar datos estructurados de forma segura y duradera en el navegador.

3. **El desacoplamiento entre Estado y Componentes simplifica la escalabilidad**:
   Al aislar el Store (`recipes.js`) de la vista, modificar un filtro o agregar una receta dispara automáticamente actualizaciones predecibles en la cuadrícula sin acoplamiento entre componentes.

4. **El valor de la accesibilidad y los estándares web**:
   Utilizar modales `<dialog>` nativos con soporte para teclado (`Esc`), enfoque accesible y navegación intuitiva proporciona una experiencia superior tanto en dispositivos móviles como en pantallas de escritorio.

5. **PWA y Service Worker convierten la web en una aplicación de primera clase**:
   Gestionar el ciclo de vida del Service Worker (instalación, activación, interceptación de peticiones) permite que una aplicación web continúe funcionando con total fluidez en entornos sin conectividad (avión, cocina sin Wi-Fi, etc.).
