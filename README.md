# MoldeoJS
Javascript Moldeo Platform

Moldeo is an Open Source platform for making interactive projects. MoldeoJS is it's lighter version, to be used in web browsers.
# Features in MoldeoJS
- Export projects recorded from your screen.
- Access different webcams and display simultaneously.
- Parcticles system rendered in real time using Euler algorithm.
- Multiple Audiovisual processes in a same canvas. 

# Pre-requisites
1) Install  [NodeJS](https://nodejs.org/es/) > 6.9.0
2) Install [NPM](https://docs.npmjs.com/getting-started/installing-node) > 3.0
3) Install [Angular-CLI](https://angular.io/guide/quickstart)  desde tu terminal usando el comando: 

```sh
$npm install -g @angular/cli
```

#  Execute MoldeoJS
Install the dependencies and MoldeoJS from your console typing
```sh
$ npm install  
```

# Open an existing project to start using the platform 
You can use existing projects (samples) created by Moldeo’s community. You can find them in “moldeojs/a2cli/src/assets/molrepos”, and you can display them from Samples button in the menu. You can also download projects from http://proyectos.moldeo.org/proyecto#head


# Plugins
Plugins are applied in chronological order, in three stages inside the drawing cycle:

**Pre-effect:** Modifies the image. This is the first stage of effects and are applied directly to the image we are working on.

- Erase  (Changes the background color cleaning the canvas)
- Mirrorg (to blur the background of the image)

**Effect:** Adds elements to the image.
- Icon (Generates 2d icons)
- Image (Loads image as texture)
- Plane (Generates 3D assets)
- [ParticlesSimple](http://proyectos.moldeo.org/documentation/moldeoplugins/Effects/ParticlesSimple/doc/es/html/index.html) (Simple particles effect, in Euler’s logarithm)
- Camera (Access to the user’s webcam)


**Post- Effect:**  Apply filters to the final image. 
- Mapping (transform the final image to fit a desired shape)
- Add filter to all the elements of an image (contrast)
- Crop an image.


# Contact:
info@moldeo.org
[Moldeo's Community on Facebook](https://www.facebook.com/comunidadmoldeo?3e71y) 
www.moldeo.org

# Demo
https://moldeojs.moldeo.org/a2cli/dist/

# Licence
[GNU GPL](https://github.com/moldeo/moldeojs/blob/master/LICENSE)
