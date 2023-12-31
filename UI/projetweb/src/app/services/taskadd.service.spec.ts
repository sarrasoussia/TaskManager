import { TestBed } from '@angular/core/testing';

import { TaskaddService } from './taskadd.service';

describe('TaskaddService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskaddService = TestBed.get(TaskaddService);
    expect(service).toBeTruthy();
  });
});
