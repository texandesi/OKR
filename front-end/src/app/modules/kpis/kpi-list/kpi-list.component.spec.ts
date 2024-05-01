import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KpiListComponent} from "./kpi-list.component";

describe('KeyResultsComponent', () => {
  let component: KpiListComponent;
  let fixture: ComponentFixture<KpiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KpiListComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
