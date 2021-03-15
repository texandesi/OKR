import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyResultsComponent} from './key-results.component';

describe('KeyResultsComponent', () => {
  let component: KeyResultsComponent;
  let fixture: ComponentFixture<KeyResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyResultsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
