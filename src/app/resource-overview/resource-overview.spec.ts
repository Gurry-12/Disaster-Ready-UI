import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceOverview } from './resource-overview';

describe('ResourceOverview', () => {
  let component: ResourceOverview;
  let fixture: ComponentFixture<ResourceOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
