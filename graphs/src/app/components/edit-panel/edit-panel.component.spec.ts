import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPanelComponent } from './edit-panel.component';

describe('EditPanelComponent', () => {
  let component: EditPanelComponent;
  let fixture: ComponentFixture<EditPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPanelComponent]
    });
    fixture = TestBed.createComponent(EditPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
