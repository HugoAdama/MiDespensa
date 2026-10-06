# 05 - Guía de Uso y Casos de Prueba

Esta guía explica paso a paso cómo probar cada una de las funcionalidades implementadas en **MiDespensa**.

---

## 1. Puesta en Marcha

1. Asegúrate de tener Node.js instalado.
2. Inicia el servidor local:
   ```bash
   npm run dev
   # o bien:
   npx serve -l 3000 .
   ```
3. Abre tu navegador en **`http://localhost:3000`**.

---

## 2. Casos de Prueba Paso a Paso

### Prueba 1: CRUD de Recetas (Crear, Ver, Editar, Duplicar, Borrar)
1. **Crear**: Pulsa el botón **"+ Nueva Receta"** en la cabecera.
   - Completa el título (ej. *"Tacos de Pescado Baja"*).
   - Selecciona categoría *"Almuerzo"*, tiempo *"25"* min y porciones *"3"*.
   - Pulsa en un preset de imagen sugerido (ej. *"Tacos / Mex"*).
   - Añade 2 ingredientes usando el botón "+ Agregar ingrediente" (ej. *"400 g filete de pescado"*, *"6 unidades tortillas de maíz"*).
   - Añade 2 pasos de preparación y pulsa **"Guardar Receta"**.
   - **Resultado esperado**: La nueva tarjeta aparece instantáneamente al inicio de la cuadrícula y se muestra una notificación toast de confirmación.
2. **Ver**: Haz clic sobre la tarjeta recién creada. Se abrirá el modal de detalle con la imagen, etiquetas y lista de ingredientes.
3. **Duplicar**: En el pie del modal de detalle, pulsa **"Duplicar"**. Se creará una copia con el sufijo *(Copia)*.
4. **Editar**: En el modal de detalle, pulsa **"Editar"**, modifica el tiempo de cocción y guarda los cambios.
5. **Borrar**: Pulsa **"Eliminar"**, confirma en el diálogo nativo y comprueba que la tarjeta desaparece de la vista.

---

### Prueba 2: Escalado Dinámico de Porciones
1. Abre la receta predeterminada *"Paella Tradicional"* (base: 4 porciones).
2. Observa la cantidad de arroz bomba: `400 g de arroz bomba`.
3. En el widget superior derecho **"Escalar Porciones"**, pulsa el botón `+` para subir a **8 personas**.
4. **Resultado esperado**: La cantidad de arroz se recalcula al instante a `800 g de arroz bomba`, el caldo pasa de 1 litro a 2 litros, y las judías verdes a 400 g.
5. Reduce a **2 personas**: Las cantidades se dividen por la mitad automáticamente.

---

### Prueba 3: Despensa Inteligente ("¿Qué tengo en casa?")
1. Pulsa el botón **"¿Qué tengo en casa?"** en la parte superior.
2. Se desplegará el panel de despensa.
3. Pulsa sobre las sugerencias rápidas: `+ Huevos` y `+ Plátano`.
4. Observa cómo la cuadrícula de recetas se reorganiza automáticamente:
   - La receta *"Pancakes Esponjosos de Avena y Plátano"* mostrará un badge verde indicando alta coincidencia con los ingredientes que posees.
5. Escribe un ingrediente personalizado en el campo de texto (ej. *"aguacate"*) y pulsa Enter. Las recetas con aguacate subirán al inicio.

---

### Prueba 4: Modo Cocina y Temporizador Interactivo
1. Abre cualquier receta.
2. En la lista de ingredientes, haz clic sobre varios checkboxes: el texto se tachará visualmente para que sepas qué tienes preparado.
3. En la sección inferior **"Temporizador de Cocina"**, pulsa **"Iniciar"**.
4. Pulsa sobre el botón con los minutos para colocar un tiempo corto de prueba: `0.1` minutos (6 segundos).
5. Pulsa **"Iniciar"** y espera que llegue a `00:00`.
6. **Resultado esperado**: Sonará una campana digital sintetizada con la Web Audio API y aparecerá la notificación *"¡Tiempo terminado!"*.

---

### Prueba 5: Respaldo y Restauración JSON
1. En la cabecera, haz clic en el icono de copia de seguridad (dos flechas circulares).
2. Pulsa **"Descargar Archivo JSON"**.
   - **Resultado esperado**: Se descargará en tu equipo el archivo `midespensa_recetas_YYYY-MM-DD.json`.
3. Prueba a modificar o borrar recetas en la aplicación.
4. Vuelve al modal de copia de seguridad, selecciona tu archivo JSON con el selector de archivos y pulsa **"Reemplazar todo"**.
   - **Resultado esperado**: Todas tus recetas originales se restablecen inmediatamente.

---

### Prueba 6: PWA e Instalación Offline
1. En Google Chrome o Edge, verás el botón **"Instalar App"** o el icono de instalación en la barra de direcciones.
2. Instala la app y ábrela desde el acceso directo de tu escritorio.
3. Desconecta tu conexión a Internet o activa el Modo Avión en tu sistema operativo.
4. Recarga la aplicación.
   - **Resultado esperado**: La app carga de forma instantánea gracias al Service Worker, el badge de conexión cambia a *"Sin conexión"*, y puedes seguir consultando, creando recetas y usando el temporizador sin fallos.
