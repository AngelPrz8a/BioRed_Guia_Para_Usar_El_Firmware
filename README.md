# Guía interactiva BioRed

El fondo y las ilustraciones de `images/` se adaptaron del recurso educativo del SENA «Características de la computación en la nube». El recurso declara una licencia Creative Commons de atribución, no comercial y compartir igual; se deben conservar la atribución y sus condiciones al distribuir adaptaciones.

Guía de aprendizaje para preparar y usar el firmware BioRed con una placa ESP32. Está hecha con HTML, CSS y JavaScript nativos: no requiere Vue, Node.js, npm, instalación, compilación ni servidor.

## Abrir la guía

`index.html` se abre con doble clic en un navegador. También se puede copiar la carpeta completa a un servicio de alojamiento estático.

### Publicar en GitHub Pages

1. Se sube el contenido de esta carpeta al repositorio de GitHub, conservando su estructura.
2. En el repositorio, se abre **Settings → Pages**.
3. En **Build and deployment**, se selecciona **Deploy from a branch**, la rama correspondiente y la carpeta raíz (`/`); luego se guarda la configuración.
4. Se abre la dirección que GitHub Pages muestra en esa sección.

La página y sus recursos usan rutas relativas, por lo que también funcionan cuando GitHub Pages publica el sitio en una ruta de proyecto. No se necesita un flujo de compilación.

## Contenido e imágenes

- Los textos, preguntas de repaso y ocho secciones están en `src/course.js`.
- La interfaz y las interacciones están en `src/app.js`; los estilos, en `src/style.css`.
- Las preguntas son actividades opcionales de repaso. Una respuesta incorrecta muestra una pista y no bloquea la navegación.
- Cada tema organiza sus contenidos esenciales, recomendados y notas en desplegables; las galerías permiten recorrer las imágenes asociadas.
- Para añadir una imagen, se guarda en `images/`. La ruta, el texto alternativo y el pie de imagen se modifican en `src/course.js`; para una imagen principal se modifican `image` e `imageAlt` de la sección. Se utilizan rutas relativas como `images/mi-foto.png` para que funcione al abrir el archivo localmente y en GitHub Pages.
- Los enlaces a repositorios, documentación y bibliotecas se editan en `resources` de cada sección o paso.

El contenido sigue el orden del material de aprendizaje: hardware, red, software, librerías, preparación del proyecto, elección de salida, puesta en marcha y notas finales. Antes de cablear, se recomienda confirmar las conexiones con el pinout del modelo exacto de placa.
