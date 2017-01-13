/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoldeoControlComponent } from './moldeo-control.component';

describe('MoldeoControlComponent', () => {
  let component: MoldeoControlComponent;
  let fixture: ComponentFixture<MoldeoControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoldeoControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoldeoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
