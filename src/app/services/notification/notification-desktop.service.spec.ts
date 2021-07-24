import { TestBed } from '@angular/core/testing';

import { NotificationDesktopService } from './notification-desktop.service';

describe('NotificationDesktopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationDesktopService = TestBed.get(NotificationDesktopService);
    expect(service).toBeTruthy();
  });
});
