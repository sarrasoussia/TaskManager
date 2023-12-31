import { TestBed } from '@angular/core/testing';

import { AddcollaboratorService } from './addcollaborator.service';

describe('AddcollaboratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddcollaboratorService = TestBed.get(AddcollaboratorService);
    expect(service).toBeTruthy();
  });
});
