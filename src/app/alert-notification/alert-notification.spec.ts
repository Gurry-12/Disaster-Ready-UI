import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNotification } from './alert-notification';

describe('AlertNotification', () => {
  let component: AlertNotification;
  let fixture: ComponentFixture<AlertNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
