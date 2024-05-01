import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveEditComponent } from './objective-edit.component';

describe('AddObjectiveComponentComponent', () => {
  let component: ObjectiveEditComponent;
  let fixture: ComponentFixture<ObjectiveEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ObjectiveEditComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
