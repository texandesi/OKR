import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyResultEditComponent } from './keyresult-edit.component';

describe('AddObjectiveComponentComponent', () => {
  let component: KeyResultEditComponent;
  let fixture: ComponentFixture<KeyResultEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyResultEditComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
