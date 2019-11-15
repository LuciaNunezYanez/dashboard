import { TestBed } from '@angular/core/testing';

import { ComercioService } from './comercio.service';

describe('ComercioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComercioService = TestBed.get(ComercioService);
    expect(service).toBeTruthy();
  });
});
