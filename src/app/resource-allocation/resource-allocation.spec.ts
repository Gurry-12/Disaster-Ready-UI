import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAllocation } from './resource-allocation';

describe('ResourceAllocation', () => {
  let component: ResourceAllocation;
  let fixture: ComponentFixture<ResourceAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceAllocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceAllocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
