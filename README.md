# SOBELO

SOBELO es una aplicacion web para reproducir canciones desde el navegador, con una experiencia enfocada en simplicidad, control y fluidez. El sistema permite gestionar una cola de reproduccion dinamica, navegar entre pistas y mantener el estado de reproduccion de manera consistente durante toda la sesion.

## Enlace a la aplicacion

Acceso directo:

https://ingmao021.github.io/SOBELO/

## Proposito del proyecto

El objetivo de SOBELO es ofrecer un reproductor musical moderno, accesible y facil de usar, en el que el usuario pueda:

- Cargar canciones en lista de reproducción.
- Reproducir, pausar y navegar entre pistas de forma intuitiva.
- Administrar el orden de reproduccion con opciones como avance, retroceso, limpieza de lista y mezcla aleatoria.
- Visualizar una interfaz clara para interactuar con el contenido multimedia.

## Estructura de datos utilizada

El nucleo del sistema se apoya en una estructura de datos de lista doblemente enlazada implementada mediante las entidades `MusicPlayer` y `SongNode`.

## Stack tecnologico

### Frontend

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vitest
- CSS

### Nucleo de datos y logica

- TypeScript
- Implementacion propia de `MusicPlayer` y `SongNode`
- Pruebas con Mocha

### Herramientas de desarrollo

- ESLint
- npm
- GitHub Pages (despliegue de la aplicacion web)

## Funcionamiento general

DEl sistema ofrece la experiencia de usuario de la siguiente manera:

1. El usuario accede a la aplicacion desde el navegador.
2. Agrega canciones a su lista de reproduccion.
3. Selecciona una pista y utiliza los controles de reproduccion (p^lay, pausa, siguiente, anterior).
4. Puede reorganizar o limpiar la lista segun su preferencia.
5. La interfaz refleja en tiempo real el estado actual de la reproduccion.

### 1. Vista principal del reproductor

Pantalla inicial con el reproductor activo, barra de navegacion y componentes principales de reproduccion.

![Vista principal del reproductor](./frontend/dist/assets/image.png)

### 2. Gestion de la lista de reproduccion

Seccion donde se visualiza la lista de canciones y las acciones para agregar, agregar carpeta o limpiar la lissta de reproducción.

![Gestion de playlist](./frontend/dist/assets/img_2.png)

### 3. Controles y estado de reproduccion

Descripcion: detalle de los controles de reproduccion y del estado actual de la cancion en curso.

![Controles y estado de reproduccion](./frontend/dist/assets/imagen_3.png)

