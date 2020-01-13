import { TestBed } from '@angular/core/testing';

import { IncidentesService } from './incidentes.service';

describe('IncidentesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncidentesService = TestBed.get(IncidentesService);
    expect(service).toBeTruthy();
  });
});
