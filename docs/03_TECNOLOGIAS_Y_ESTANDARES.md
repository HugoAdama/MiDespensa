# 03 - Tecnologías y Estándares Web Modernos

Este documento profundiza en la selección técnica y la justificación de las tecnologías nativas aplicadas en el proyecto.

---

## 1. Persistencia: IndexedDB vs. LocalStorage

### ¿Por qué IndexedDB para un gestor de recetas?
- **Estructura relacional/objetos**: Las recetas no son simples cadenas de texto; son objetos ricos con arrays anidados de ingredientes, pasos y metadatos.
- **Asincronía y no-bloqueo**: `localStorage` es síncrono; si se guardan cientos de recetas con imágenes, cada lectura/escritura bloquea el hilo principal (Main Thread) de la interfaz, congelando animaciones y desplazamientos. IndexedDB opera mediante transacciones asíncronas basadas en eventos y promesas.
- **Límite de capacidad**: `localStorage` está restringido a ~5MB por origen, mientras que IndexedDB permite almacenar cientos de megabytes según el espacio disponible en disco del usuario.
- **Consultas indexadas**: Creamos índices dedicados para buscar rápidamente por título, categoría, favoritos y fecha de actualización:
  ```javascript
  store.createIndex('category', 'category', { unique: false });
  store.createIndex('favorite', 'favorite', { unique: false });
  ```

### Estrategia de Fallback Resiliente
En entornos donde IndexedDB puede estar inhabilitado (como pestañas de navegación privada hiper-restrictiva en navegadores antiguos), el módulo [`db.js`](file:///e:/GESTOR_RECETAS/js/db.js) captura la excepción y conmuta de forma transparente hacia `localStorage` sin interrumpir la experiencia del usuario.

---

## 2. Progressive Web App (PWA) y Service Worker

### Manifiesto Web (`manifest.webmanifest`)
Define la identidad de la aplicación para el sistema operativo anfitrión:
- `display: "standalone"`: La aplicación se abre en su propia ventana, ocultando la barra de navegación del navegador web.
- `theme_color`: Establece el color de la barra de título de la ventana nativa.
- Iconos vectoriales SVG adaptables (`purpose: "any maskable"`).

### Ciclo de Vida del Service Worker (`sw.js`)
1. **Instalación (`install`)**: Pre-almacena en caché la totalidad de los archivos estáticos necesarios para la aplicación (HTML, CSS modular, módulos JS, iconos vectoriales).
2. **Activación (`activate`)**: Revisa las versiones de caché existentes y purga de forma segura las versiones antiguas cuando se detecta una nueva versión (ej. migración a `midespensa-v1`).
3. **Interceptación de red (`fetch`)**: Implementa la estrategia **Stale-While-Revalidate**:
   - Devuelve inmediatamente el archivo local desde la caché para conseguir tiempos de respuesta de 0 ms.
   - En paralelo, envía una petición a la red para descargar cualquier actualización e insertarla silenciosamente en la caché para la próxima sesión.

---

## 3. Web Audio API (Alarma Acústica Offline)

En lugar de requerir la descarga de archivos `.mp3` o `.wav` (que podrían fallar en modo offline o introducir latencia), se construyó un sintetizador en tiempo real:

```javascript
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.type = 'sine';
osc.frequency.setValueAtTime(freq, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
```

- **Ventajas**:
  - 0 KB de peso adicional en la red.
  - Generación de acordes armónicos (Re 587.33 Hz → La 880 Hz → Re 1174.66 Hz).
  - Reproducción garantizada sin importar el estado de conectividad.

---

## 4. Diálogos Nativos de HTML5 (`<dialog>`)

Los modales tradicionales con librerías externas arrastran decenas de kilobytes para manejar el foco y el bloqueo de scroll. El elemento `<dialog>` nativo resuelve esto en el motor del navegador:
- Trampa de foco accesible (Focus trapping) automática.
- Invocación con `.showModal()`, colocando el modal en la capa superior (*Top Layer*) del renderizador.
- Soporte nativo para la tecla `Escape`.
- Estilización directa del pseudo-elemento `::backdrop` con `backdrop-filter: blur(6px)`.
- Fallback matemático de clic en backdrop mediante `getBoundingClientRect()` para navegadores que aún completan la especificación `closedby="any"`.
