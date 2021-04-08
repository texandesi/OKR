import { ComponentFixture, TestBed } from '@angular/core/testing';
import {KeyResultsEditComponent} from "./key-results-edit.component";


describe('AddKeyResultComponentComponent', () => {
  let component: KeyResultsEditComponent;
  let fixture: ComponentFixture<KeyResultsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyResultsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
