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
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

2) Install [NPM](https://docs.npmjs.com/getting-started/installing-node) > 3.0
3) Install [Angular-CLI](https://angular.io/guide/quickstart)  desde tu terminal usando el comando:

```sh
$ npm install -g @angular/cli
```

#  Execute MoldeoJS
Install the dependencies and MoldeoJS from your console typing
```sh
$ npm install  
```

# Run the server with:
```sh
$ npm start
```

#Build to deploy later in a site
```sh
$ npm run buildsite
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

- Sound (based on P5.js oscillator)
- Faust (Faust sound compiler for javascript based on wasm and webaudio) https://github.com/faust/tree/architecture/webaudio
  
  IMPORTANT modify some things like:
    The base library file libfaust-wasm.js: 
      var REMOTE_PACKAGE_BASE="libfaust-wasm.data"; 
    with:
      var REMOTE_PACKAGE_BASE="./assets/data/effects/faust/libfaust-wasm.data";
      
    Then for each compiled effect do:
    
    Modify the .js file (compiled with 'faust2wasm -worklet wind.dsp'), aka 'wind.js' reference with the correct path,
    replace:
      let real_url = (this.baseURL === "") ? "wind.wasm" : (this.baseURL + "/wind.wasm");
    with:
      let real_url = (this.baseURL === "") ? "wind.wasm" : (this.baseURL + "/assets/effects/faust/wind.wasm");
    
    Modify the dspName constant with a specific one,
    replace:
      const dspName = "wind"
      ...
      window[dspName] = wind;
    with:
      const dspNameWind = "wind"
      ...
      window[dspNameWind] = wind;
      
    Then check that you added to header of your index.html for every effect, the script link to the js file, like this:
          <script name="faustnoise" src="./assets/data/effects/faust/wind.js"></script>
        

      
- ML5 (based on ml5.js https://github.com/ml5js) works with live camera, and texture buffers (image/texture collections) for image classification

**Post- Effect:**  Apply filters to the final image.
- Mapping (transform the final image to fit a desired shape)
- Add filter to all the elements of an image (contrast)
- Crop an image.


# Contact:
- info@moldeo.org
- [Moldeo's Community on Facebook](https://www.facebook.com/comunidadmoldeo?3e71y)
- www.moldeo.org

# Demo
https://moldeojs.moldeo.org/a2cli/dist/

# Licence
[GNU GPL](https://github.com/moldeo/moldeojs/blob/master/LICENSE)
