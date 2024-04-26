import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KeyResultListComponent} from "./key-result-list.component";

describe('KeyResultsComponent', () => {
  let component: KeyResultListComponent;
  let fixture: ComponentFixture<KeyResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyResultListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
