import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReporting } from './incident-reporting';

describe('IncidentReporting', () => {
  let component: IncidentReporting;
  let fixture: ComponentFixture<IncidentReporting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentReporting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentReporting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
