import { TestBed } from '@angular/core/testing';

import { UsuariosNitService } from './usuarios-nit.service';

describe('UsuariosNitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuariosNitService = TestBed.get(UsuariosNitService);
    expect(service).toBeTruthy();
  });
});
