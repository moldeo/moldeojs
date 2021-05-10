/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ConsoleService } from './console.service';

describe('ConsoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsoleService]
    });
  });

  it('should ...', inject([ConsoleService], (service: ConsoleService) => {
    expect(service).toBeTruthy();
  }));
});
