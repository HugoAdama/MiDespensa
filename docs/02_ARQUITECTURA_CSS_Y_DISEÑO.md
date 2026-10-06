# 02 - Arquitectura CSS y Separación de Responsabilidades de Estilos

## 1. Visión General
La arquitectura de estilos de **SaborCraft** sigue una metodología modular en capas inspirada en **SMACSS** (Scalable and Modular Architecture for CSS) e **ITCSS** (Inverted Triangle CSS). 

Se abandonó el archivo CSS monolítico para dar paso a hojas de estilo atómicas donde cada archivo tiene una única y estricta responsabilidad.

---

## 2. Estructura de Directorios CSS

```
css/
├── variables.css            # 1. Tokens de diseño (Colores, modo claro/oscuro, radios, sombras)
├── base.css                 # 2. Reset global, tipografía base y animaciones
├── main.css                 # 3. Manifiesto maestro que importa todas las capas en orden
│
├── layout/                  # 4. Capa de Layout (Estructura y contenedores macro)
│   ├── header.css           #    Barra superior sticky, branding y acciones globales
│   ├── filters.css          #    Buscador, barra de píldoras de navegación y selectores
│   └── grid.css             #    Contenedor principal, cuadrícula responsive y estado vacío
│
└── components/              # 5. Capa de Componentes (Elementos UI autónomos y reutilizables)
    ├── buttons.css          #    Botones primarios, secundarios, píldoras e iconos
    ├── cards.css            #    Tarjetas de receta, portadas, badges de categoría
    ├── dialogs.css          #    Modales nativos (<dialog>), backdrop blur y contenedor
    ├── forms.css            #    Inputs, selects, textareas y filas dinámicas de editor
    ├── scaler.css           #    Contador de escalado de porciones y checklist interactivo
    ├── timer.css            #    Widget del temporizador culinario y display digital
    ├── pantry.css           #    Banner desplegable de despensa y chips de ingredientes
    └── toasts.css           #    Notificaciones flotantes y badge de estado de red
```

---

## 3. Desglose de Responsabilidades por Archivo

### A. Capa de Tokens y Variables (`css/variables.css`)
- **Responsabilidad**: Define las fuentes de verdad del sistema de diseño.
- **Contenido**: Paleta de colores culinarios (Azafrán `#E84A27`, Menta `#0D9488`, Ámbar `#F59E0B`), valores de neutrales, sombras de elevación, curvas de transición `cubic-bezier` y tokens de glassmorphism.
- **Tematización**: Implementa el soporte para `data-theme="dark"` redefiniendo variables semánticas (`--bg-app`, `--text-main`, `--bg-card`) sin duplicar código en los componentes.

### B. Capa Base (`css/base.css`)
- **Responsabilidad**: Normalización del navegador (Box Model `border-box`), scroll suave, barras de desplazamiento personalizadas (*custom scrollbars*), tipografía base y definiciones `@keyframes` globales.

### C. Capa de Layout (`css/layout/`)
Define la estructura espacial de la pantalla donde se alojan los componentes:
1. **`layout/header.css`**: Fija la cabecera en el viewport (`position: sticky`), aplica el desenfoque de fondo (*backdrop-filter*), y ajusta el branding responsivo en pantallas móviles.
2. **`layout/filters.css`**: Modela la sección superior de búsqueda y la barra de desplazamiento horizontal de categorías (*scrollable pills bar*).
3. **`layout/grid.css`**: Aplica CSS Grid responsive con `grid-template-columns: repeat(auto-fill, minmax(310px, 1fr))`, el contenedor con ancho máximo delimitado y el botón flotante móvil (FAB).

### D. Capa de Componentes (`css/components/`)
Contiene estilos aislados e independientes del lugar donde se ubiquen:
1. **`components/buttons.css`**: Estilos de interacción `:hover`, `:active`, sombras de brillo (*primary glow*) y variantes semánticas.
2. **`components/cards.css`**: Elevación de tarjetas, efecto de zoom en la fotografía de portada y badges de categoría.
3. **`components/dialogs.css`**: Estilización del pseudo-elemento nativo `dialog::backdrop` con desenfoque de lente (*blur*), animación de entrada `popIn` y limitación de altura máxima con scroll interno.
4. **`components/forms.css`**: Campos de formulario accesibles con anillos de enfoque (*focus rings*), rejillas adaptables de 2 columnas y filas dinámicas para agregar ingredientes y pasos.
5. **`components/scaler.css`**: Control numérico redondeado con botones `+` y `-` para el recálculo instantáneo de porciones, y lista de verificación tachada al marcar ingredientes listos.
6. **`components/timer.css`**: Caja de temporizador culinario con fuente tipográfica monoespaciada para evitar saltos de línea numéricos.
7. **`components/pantry.css`**: Gradiente suave de despensa, chips removibles con botón `✕` y sugerencias punteadas en un clic.
8. **`components/toasts.css`**: Contenedor con `pointer-events: none` y alertas individuales con barra de acento lateral según severidad.

---

## 4. Manifiesto Maestro (`css/main.css`)
En lugar de forzar a HTML a cargar decenas de etiquetas `<link>`, `main.css` actúa como orquestador central que importa cada capa en su estricto orden de especificidad, asegurando compatibilidad óptima y mantenimiento simplificado.
