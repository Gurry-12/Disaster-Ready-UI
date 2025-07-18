import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsHeatmaps } from './analytics-heatmaps';

describe('AnalyticsHeatmaps', () => {
  let component: AnalyticsHeatmaps;
  let fixture: ComponentFixture<AnalyticsHeatmaps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsHeatmaps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsHeatmaps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
