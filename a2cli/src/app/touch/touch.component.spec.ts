/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TouchComponent } from './touch.component';

describe('TouchComponent', () => {
  let component: TouchComponent;
  let fixture: ComponentFixture<TouchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
