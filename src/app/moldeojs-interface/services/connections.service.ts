import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class ConnectionsService {
  public renderer: Renderer2;
  //Vars for Drawing
  public pathStraight:number = 10;
  public pathCurve:number = 60;

  //Funs for Listener
  public globalMouseMove: () => void;
  public globalMouseUp: () => void;

  constructor() { }

  public dataOut(e:any, moObj:any, moPcon:any, moCon:any, color:string): void{
    let this_ = this;
    let onInlet:boolean = false;
    let out:any = e.target;
    let x:number = parseInt(moObj.style.left.replace("px","")) +
    moObj.clientWidth - e.target.clientWidth/2;
    let y:number = parseInt(moObj.style.top.replace("px","")) +
    moObj.clientHeight - e.target.clientHeight/2;

    moPcon.innerHTML = '<g><path style="fill:none;stroke-linecap:square;stroke-width:5;" d="" stroke="#'+color+'"></path></g>';

    let overInlet = this.renderer.listen("document", "mouseup", (e) =>{
      if(onInlet){
        let tx:number = parseInt(e.target.offsetParent.style.left.replace("px","")) + e.target.clientWidth/2;
        let ty:number = parseInt(e.target.offsetParent.style.top.replace("px","")) + e.target.clientHeight/2;
        let curve = this.svgPath(x, y, tx, ty);
        let newG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        moCon.appendChild(newG);
        let newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        moCon.children[moCon.children.length - 1].appendChild(newPath);
        moCon.children[moCon.children.length - 1].children[0].setAttribute("style", "fill:none;stroke-linecap:square;stroke-width:5;");
        moCon.children[moCon.children.length - 1].children[0].setAttribute("stroke", "#"+color+"");
        moCon.children[moCon.children.length - 1].children[0].setAttribute("d", curve);
        moCon.children[moCon.children.length - 1].outlet = out;
        moCon.children[moCon.children.length - 1].inlet = e.target;
        overInlet();
      }
    });

    this.globalMouseMove = this.renderer.listen("document", 'mousemove', (e) => {
      let curve = this.svgPath(x, y, e.clientX, e.clientY);
      moPcon.children[moPcon.children.length - 1].children[0].setAttribute("d", curve);
      if(e.target.className == "moInlet"){
        onInlet = true;
      }else{
        onInlet = false;
      }
    });

    this.globalMouseUp = this.renderer.listen("document", 'mouseup', () => {
      if (this_.globalMouseMove) {
        this_.globalMouseMove();
        if(moPcon.children[0]){
            moPcon.children[0].remove();
        }
      }
      this.globalMouseUp();
    });
  }

  public updateCon(moObj:any, moCon:any): void{
    for(let i = 0; i < moCon.nativeElement.children.length; i++){
      if(moCon.nativeElement.children[i].inlet.offsetParent){
        let outlet:any = moCon.nativeElement.children[i].outlet;
        let inlet:any = moCon.nativeElement.children[i].inlet;
        let toX:number = parseInt(moObj.nativeElement.style.left.replace("px","")) +
        moObj.nativeElement.clientWidth - outlet.clientWidth/2;
        let toY:number = parseInt(moObj.nativeElement.style.top.replace("px","")) +
        moObj.nativeElement.clientHeight - outlet.clientHeight/2;
        let fromX:number = parseInt(inlet.offsetParent.style.left.replace("px","")) + inlet.clientWidth/2;
        let fromY:number = parseInt(inlet.offsetParent.style.top.replace("px","")) + inlet.clientHeight/2;

        let curve = this.svgPath(toX, toY, fromX, fromY);
        moCon.nativeElement.children[i].children[0].setAttribute("d", curve);
      }else{
        moCon.nativeElement.children[i].remove();
      }
    }
  }

  //CALC SVG CURVE PATH
  private svgPath(x:number, y:number, tx:number, ty:number): string {
    let fromX = x;
    let fromY = y;
    let toX = tx;
    let toY = ty;

    return "M "+ fromX +" "+ fromY +
      " L "+ (fromX+this.pathStraight) +" "+ fromY +
      " C "+ (fromX+this.pathCurve) +" "+ fromY +" "+ (toX-this.pathCurve) +" "+ toY +" "+ (toX-this.pathStraight) +" "+ toY +
      " L "+ toX +" "+ toY;
  }
}
