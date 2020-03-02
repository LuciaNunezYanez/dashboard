import { TestBed } from '@angular/core/testing';

import { LocalizacionService } from './localizacion.service';

describe('LocalizacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalizacionService = TestBed.get(LocalizacionService);
    expect(service).toBeTruthy();
  });
});
