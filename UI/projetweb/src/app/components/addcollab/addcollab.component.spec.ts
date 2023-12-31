import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcollabComponent } from './addcollab.component';

describe('AddcollabComponent', () => {
  let component: AddcollabComponent;
  let fixture: ComponentFixture<AddcollabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcollabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
