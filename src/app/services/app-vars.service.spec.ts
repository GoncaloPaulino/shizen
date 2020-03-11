import { TestBed } from '@angular/core/testing';

import { AppVarsService } from './app-vars.service';

describe('AppVarsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppVarsService = TestBed.get(AppVarsService);
    expect(service).toBeTruthy();
  });
});
