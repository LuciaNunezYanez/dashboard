import { TestBed } from '@angular/core/testing';

import { UtilidadesService } from './utilidades.service';

describe('UtilidadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilidadesService = TestBed.get(UtilidadesService);
    expect(service).toBeTruthy();
  });
});
