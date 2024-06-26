import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveDetailComponent } from './objective-detail.component';

describe('ObjectiveDetailComponent', () => {
  let component: ObjectiveDetailComponent;
  let fixture: ComponentFixture<ObjectiveDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ObjectiveDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
