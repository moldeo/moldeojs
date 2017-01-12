import { Component, ElementRef, OnInit } from '@angular/core';
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;
import Scene = THREE.Scene;
import TrackballControls = THREE.TrackballControls;
import PerspectiveCamera = THREE.PerspectiveCamera;
import Mesh = THREE.Mesh;

@Component({
  selector: 'app-threeviewer',
  templateUrl: './threeviewer.component.html',
  styleUrls: ['./threeviewer.component.css']
})
export class ThreeviewerComponent implements OnInit {

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    geometry: THREE.Geometry;
    sphere: THREE.SphereGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    controls: THREE.TrackballControls;
    hostElement: ElementRef;

    constructor(el: ElementRef) {
      this.hostElement = el;
    }

    ngOnInit() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true});
        this.renderer.setSize( 500, 500);
        this.renderer.setClearColor( 0xFF000000, 1 );
        this.hostElement.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.clear();


        this.scene = new THREE.Scene();

        //this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera = new THREE.PerspectiveCamera( 75, this.renderer.getSize().width / this.renderer.getSize().height, 1, 10000 );
        this.camera.position.z = 10;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(300, 0, 300);
        this.scene.add(pointLight);

//     this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
//     this.material = new THREE.MeshBasicMaterial( { color: 0x00FF00, wireframe: true } );

        //this.controls = new THREE.TrackballControls(this.camera, this.hostElement.nativeElement );

        // Sphere

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('assets/earth.jpg', t => {
            this.sphere = new THREE.SphereGeometry(5, 50, 50);
            this.material = new THREE.MeshLambertMaterial({map: t});
            this.mesh = new THREE.Mesh( this.sphere, this.material);

            this.scene.add(this.mesh);
            this.animate();
        });

        //this.mesh = new THREE.Mesh( this.geometry, this.material );
        //this.scene.add(this.mesh);

    }

    public animate() {
      window.requestAnimationFrame(_=>this.animate() );
      //console.log("animate", this );
      this.mesh.rotation.x += 0.001;
      this.mesh.rotation.y += 0.002;
      this.renderer.render( this.scene, this.camera );
    }

}
