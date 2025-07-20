import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeKit } from './customize-kit';

describe('CustomizeKit', () => {
  let component: CustomizeKit;
  let fixture: ComponentFixture<CustomizeKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeKit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeKit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
