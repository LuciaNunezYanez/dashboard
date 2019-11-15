import { TestBed } from '@angular/core/testing';

import { AlertasNitService } from './alertas.service';

describe('AlertasNitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertasNitService = TestBed.get(AlertasNitService);
    expect(service).toBeTruthy();
  });
});
