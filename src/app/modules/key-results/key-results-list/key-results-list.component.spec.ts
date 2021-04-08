import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KeyResultsListComponent} from "./key-results-list.component";


describe('KeyResultsComponent', () => {
  let component: KeyResultsListComponent;
  let fixture: ComponentFixture<KeyResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyResultsListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
