import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[ngDraggable]'
})
export class DraggableDirective {
  topStart:number=0;
  leftStart:number=0;
  _allowDrag:boolean = true;
  md:boolean;

  constructor(public element: ElementRef) {}

  ngOnInit(){
    if(this._allowDrag){
      this.element.nativeElement.style.position = 'absolute';
      this.element.nativeElement.classList.add('cursor-draggable');
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event:MouseEvent) {
    if(event.button === 2){
        return; //Prevents right click drag
    }
    this.md = true;
    this.topStart = event.clientY - (this.element.nativeElement.style.top.replace('px',''));
    this.leftStart = event.clientX - (this.element.nativeElement.style.left.replace('px',''));
    this.element.nativeElement.style.zIndex = '90';
  }

  @HostListener('document:mouseup') onMouseUp(event:MouseEvent) {
    this.md = false;
    this.element.nativeElement.style.zIndex = '1';
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event:MouseEvent) {
    if(this.md && this._allowDrag){
      this.element.nativeElement.style.top = ((event.clientY - this.topStart)) + 'px';
      this.element.nativeElement.style.left = ((event.clientX - this.leftStart)) + 'px';
    }
  }

  @Input('ngDraggable') set allowDrag(value:boolean){
    this._allowDrag = value;
    if(this._allowDrag){
      this.element.nativeElement.classList.add('cursor-draggable');
    }else{
      this.element.nativeElement.classList.remove('cursor-draggable');
    }
  }
}
