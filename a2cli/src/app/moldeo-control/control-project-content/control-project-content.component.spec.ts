/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ControlProjectContent } from './control-project-content.component';

describe('ControlProjectContentComponent', () => {
  let component: ControlProjectContent;
  let fixture: ComponentFixture<ControlProjectContent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlProjectContent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlProjectContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
