import { TestBed } from '@angular/core/testing';

import { CorporacionesService } from './corporaciones.service';

describe('CorporacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorporacionesService = TestBed.get(CorporacionesService);
    expect(service).toBeTruthy();
  });
});
