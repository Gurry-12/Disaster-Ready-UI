import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasterReportForm } from './disaster-report-form';

describe('DisasterReportForm', () => {
  let component: DisasterReportForm;
  let fixture: ComponentFixture<DisasterReportForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisasterReportForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisasterReportForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
