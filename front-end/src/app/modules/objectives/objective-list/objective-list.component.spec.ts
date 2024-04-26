import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectiveListComponent} from './objective-list.component';

describe('ObjectivesComponent', () => {
  let component: ObjectiveListComponent;
  let fixture: ComponentFixture<ObjectiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectiveListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
