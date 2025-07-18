import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDisasterMap } from './live-disaster-map';

describe('LiveDisasterMap', () => {
  let component: LiveDisasterMap;
  let fixture: ComponentFixture<LiveDisasterMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveDisasterMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveDisasterMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
