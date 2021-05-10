/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
//import { By } from '@angular/platform-browser';
//import { DebugElement } from '@angular/core';

import { MoldeojsViewComponent } from './moldeojs-view.component';

describe('MoldeojsViewComponent', () => {
  let component: MoldeojsViewComponent;
  let fixture: ComponentFixture<MoldeojsViewComponent>;

  beforeEach(waitForAsync(() => {
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
