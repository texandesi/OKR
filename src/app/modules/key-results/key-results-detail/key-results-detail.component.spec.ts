import { ComponentFixture, TestBed } from '@angular/core/testing';
import {KeyResultsDetailComponent} from "./key-results-detail.component";


describe('KeyResultDetailComponent', () => {
  let component: KeyResultsDetailComponent;
  let fixture: ComponentFixture<KeyResultsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyResultsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
