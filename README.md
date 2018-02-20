# MoldeoJS
Javascript Moldeo Platform

Moldeo es una plataforma de software libre que permite hacer proyectos interactivos. MoldeoJS es su versión más ligera, para poder ser utilizada desde navegadores web. 

# Features de MoldeoJS
- Exporta tus proyectos grabados desde la pantalla.
- Acceso a distintas cámaras web, con render en tiempo real.
- Procesamiento de imágenes y videos en tiempo real.
- Sistema de Particulas renderizado en tiempo real, con algoritmo de Euler.
- Múltiples procesos audiovisuales en el mismo Canvas.

# Pre-requisitos
1) Instala  [NodeJS](https://nodejs.org/es/) > 6.9.0
2) Instala [NPM](https://docs.npmjs.com/getting-started/installing-node) > 3.0
3) Instala [Angular-CLI](https://angular.io/guide/quickstart)  desde tu terminal usando el comando: 

```sh
$npm install -g @angular/cli
```

#  Ejecutá MoldeoJS
Instalá las dependencias y proyecto MoldeoJS ingresando en consola
```sh
$ npm install  
```

# Abrir un proyecto existente para empezar a utilizar la Plataforma
Podés utilizar los proyectos existentes (samples) de la comunidad de Moldeo que se encuentran en la carpeta que descargaste  “moldeojs/a2cli/src/assets/molrepos”  y visualizarlos en el menú de Samples. 
También podés escargar proyectos de la comunidad en  http://proyectos.moldeo.org/proyecto#head


# Plugins
Los plugins se aplican en orden cronológico, en 3 etapas dentro del ciclo de dibujado:

**Pre-effect:** Modifica la imagen
Esta es la primera capa de efectos que modifican directamente a la imagen que estamos trabajando.
- Erase (Cambia de color el fondo limpiando el canvas)
- Mirrorg ( esfumado de la imagen )

**Effect:** Agrega elementos a la imagen
- Icon (Generación de Icono 2d )
- Image (Carga de Imagen como Textura)
- Plane (Generación de Plano 3D)
- [ParticlesSimple](http://proyectos.moldeo.org/documentation/moldeoplugins/Effects/ParticlesSimple/doc/es/html/index.html) (Efecto de partículas simple, con motor físico por - aproximación de Euler.)
- Camera (Acceso a la cámara web del usuario)


**Post- Effect:** Aplicar filtros sobre la imagen final.
- Mapping (deformar la imagen final para que se acomode a un plano inclinado)
- Agregar un filtro a todos los elementos de la imagen (contraste)
- Recortar una parte de toda la image.


# Contacto:
info@moldeo.org
[Comunidad Moldeo Facebook](https://www.facebook.com/comunidadmoldeo?3e71y) 
moldeo.org

# Demo
https://moldeojs.moldeo.org/a2cli/dist/

# Licencia
[GNU GPL](https://github.com/moldeo/moldeojs/blob/master/LICENSE)

