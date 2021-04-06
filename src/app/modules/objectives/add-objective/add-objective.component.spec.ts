import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectiveComponent } from './add-objective.component';

describe('AddObjectiveComponentComponent', () => {
  let component: AddObjectiveComponent;
  let fixture: ComponentFixture<AddObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddObjectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
