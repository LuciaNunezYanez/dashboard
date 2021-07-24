import { TestBed } from '@angular/core/testing';

import { BusquedaService } from './busqueda.service';

describe('BusquedaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusquedaService = TestBed.get(BusquedaService);
    expect(service).toBeTruthy();
  });
});
