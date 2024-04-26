import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiEditComponent } from './kpi-edit.component';

describe('AddObjectiveComponentComponent', () => {
  let component: KpiEditComponent;
  let fixture: ComponentFixture<KpiEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
