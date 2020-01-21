/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import { By } from '@angular/platform-browser';
//import { DebugElement } from '@angular/core';

import { MoldeojsViewComponent } from './moldeojs-view.component';

describe('MoldeojsViewComponent', () => {
  let component: MoldeojsViewComponent;
  let fixture: ComponentFixture<MoldeojsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoldeojsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldeojsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
