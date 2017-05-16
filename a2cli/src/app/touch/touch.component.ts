import { Component, OnInit } from '@angular/core';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'touch-component',
  templateUrl: './touch.component.html',
  styleUrls: ['./touch.component.css']
})
export class TouchComponent implements OnInit {

  constructor(){}

  ngOnInit(){
    var stage = [];
    var manager = [];
    var Pan = [];
    var Rotate = [];
    var Pinch = [];
    var Tap = [];
    var DoubleTap = [];

    for (var i = 0; i < 4; i++) {
      var s = 'stage'+i;
      stage[i] = document.getElementById(s);

      manager[i] = new Hammer.Manager(stage[i]);

      Pan[i] = new Hammer.Pan();
      Rotate[i] = new Hammer.Rotate();
      Pinch[i] = new Hammer.Pinch();
      Tap[i] = new Hammer.Tap({
        taps: 1
      });
      DoubleTap[i] = new Hammer.Tap({
        event: 'doubletap',
        taps: 2
      });

      Rotate[i].recognizeWith([Pan[i]]);
      Pinch[i].recognizeWith([Rotate[i], Pan[i]]);
      DoubleTap[i].recognizeWith([Tap[i]]);
      Tap[i].requireFailure([DoubleTap[i]]);

      manager[i].add(Pan[i]);
      manager[i].add(Rotate[i]);
      manager[i].add(Pinch[i]);
      manager[i].add(DoubleTap[i]);
      manager[i].add(Tap[i]);
    }

    //E-MOVE//
    this.eventMove(manager[0], stage[0]);
    this.eventMove(manager[1], stage[1]);
    this.eventMove(manager[2], stage[2]);
    this.eventMove(manager[3], stage[3]);

    //E-ROTATE//
    this.eventRotate(manager[0], stage[0]);
    this.eventRotate(manager[1], stage[1]);
    this.eventRotate(manager[2], stage[2]);
    this.eventRotate(manager[3], stage[3]);

    //E-SCALE//
    this.eventScale(manager[0], stage[0]);
    this.eventScale(manager[1], stage[1]);
    this.eventScale(manager[2], stage[2]);
    this.eventScale(manager[3], stage[3]);

    ///////////////////////////////////////////
  }

  eventMove(manager:any, stage:any){
    var deltaX = 0;
    var deltaY = 0;
    manager.on('panmove', function(e) {
      var dX = deltaX + (e.deltaX);
      var dY = deltaY + (e.deltaY);
      var r = stage.style.transform.match(/rotateZ\((.*deg)\)/g);
      var s = stage.style.transform.match(/scale\((.*)\)/g);
      stage.style.transform = 'translate('+dX+'px, '+dY+'px) '+r+' '+s+'';
    });
    manager.on('panend', function(e) {
      deltaX = deltaX + e.deltaX;
      deltaY = deltaY + e.deltaY;
    });
  }

  eventRotate(manager:any, stage:any){
    var liveScale = 1;
    var currentRotation = 0;
    manager.on('rotatemove', function(e) {
        var rotation = currentRotation + Math.round(liveScale * e.rotation);
        var t = stage.style.transform.match(/translate\((.*px,.*px)\)/g);
        var s = stage.style.transform.match(/scale\((.*)\)/g);
        stage.style.transform = ''+t+' rotateZ('+rotation+'deg) '+s+'';
    });
    manager.on('rotateend', function(e) {
        currentRotation += Math.round(e.rotation);
    });
  }

  eventScale(manager:any, stage:any){
    var liveScale = 1;
    var currentScale = 1;
    manager.on('pinchmove', function(e) {
      var scale = e.scale * currentScale;
      var t = stage.style.transform.match(/translate\((.*px,.*px)\)/g);
      var r = stage.style.transform.match(/rotateZ\((.*deg)\)/g);
      stage.style.transform = ''+t+' '+r+' scale('+scale+')';
    });
    manager.on('pinchend', function(e) {
      currentScale = e.scale * currentScale;
      liveScale = currentScale;
    });
  }

}
