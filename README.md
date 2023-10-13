# MoldeoJS
Javascript Moldeo Platform

Moldeo is an Open Source platform for making interactive projects.
MoldeoJS is it's lighter version, to be used in web browsers.


# Features in MoldeoJS
- Modularity, each layer/effect as a plugin based class
- Full scripting capabilities: you can access full core functions from any scripts.
- 3D/Shaders capabilities based on Three.js
- Processing as a plugin ( experimental ) : using p5.js
- Machine learning ready: with ml5.js.
- Export screenshots, video ready using html2canvas, and html5 basics.

# Future features in MoldeoJS
- Shader edition on the fly 
- 

# IMPORTANT: Angular versions fixes

## ngx-bootstrap
### upgraded bootstrap 4.6

## Angular 9.0:
### tsconfig.json add files and include sections:
  "files": [
    "main.ts",
    "polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
### ngx-bootstrap compatibility
fixed with: import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

### Setting Max File Watches
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

## Angular 10.0:
### FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
solution: export NODE_OPTIONS=--max_old_space_size=4096

### WARNING: CommonJS Dependencies must be defined in angular.json
https://angular.io/guide/build#configuring-commonjs-dependencies
fixed adding to angular.json options: 
"allowedCommonJsDependencies": [
  "rxjs/Rx",
  "zone.js/dist/zone",
  "socket.io-client",
  "rxjs/BehaviorSubject",
  "xml-js",
  "progressbar.js",
  "p5/lib/addons/p5.sound",
  "typed-function",
  "decimal.js",
  "fraction.js",
  "complex.js"
],

### build production error in runtime: TypeError: i.BehaviorSubject is not a constructor
https://github.com/angular/angular-cli/issues/18035
solution: replace import { BehaviorSubject } from 'rxjs/BehaviorSubject' or 'rxjs/somthing' to
import { BehaviorSubject } from 'rxjs'


## Angular 11.0:

### ERROR: Migration failed: Incompatible peer dependencies found
Package "codelyzer" has an incompatible peer dependency to "@angular/compiler"
(must upgrade codelyzer/tslint to eslint in angular 11.0 as soon as possible)
Fixed with: ng update codelyzer --allow-dirty
### FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
solution: export NODE_OPTIONS=--max_old_space_size=8192

# Pre-requisites
1) Install  [NodeJS](https://nodejs.org/es/) > 6.9.0
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

2) Install [NPM](https://docs.npmjs.com/getting-started/installing-node) > 3.0
3) Install [Angular-CLI](https://angular.io/guide/quickstart) from your terminal using this command:

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

# Build to deploy later in a site
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
- [Official Site](https://www.moldeo.org)
- [Official Forum](https://odoo14.moldeo.org/forum)

# Demo
https://moldeojs.moldeo.org/

# Licence
[GNU GPL](https://github.com/moldeo/moldeojs/blob/master/LICENSE)
