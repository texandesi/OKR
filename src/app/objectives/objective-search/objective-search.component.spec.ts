import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveSearchComponent } from './objective-search.component';

describe('ObjectiveSearchComponent', () => {
  let component: ObjectiveSearchComponent;
  let fixture: ComponentFixture<ObjectiveSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
