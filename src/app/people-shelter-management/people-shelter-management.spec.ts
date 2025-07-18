import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleShelterManagement } from './people-shelter-management';

describe('PeopleShelterManagement', () => {
  let component: PeopleShelterManagement;
  let fixture: ComponentFixture<PeopleShelterManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleShelterManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleShelterManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
