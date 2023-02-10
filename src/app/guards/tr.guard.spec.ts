import { TestBed, async, inject } from '@angular/core/testing';

import { TrGuard } from './tr.guard';

describe('TrGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrGuard]
    });
  });

  it('should ...', inject([TrGuard], (guard: TrGuard) => {
    expect(guard).toBeTruthy();
  }));
});
