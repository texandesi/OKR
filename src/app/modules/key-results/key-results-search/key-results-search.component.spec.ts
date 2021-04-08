import { ComponentFixture, TestBed } from '@angular/core/testing';
import {KeyResultsSearchComponent} from "./key-results-search.component";


describe('KeyResultSearchComponent', () => {
  let component: KeyResultsSearchComponent;
  let fixture: ComponentFixture<KeyResultsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyResultsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
