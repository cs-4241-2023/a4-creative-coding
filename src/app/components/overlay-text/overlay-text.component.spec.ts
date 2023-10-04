import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayTextComponent } from './overlay-text.component';

describe('OverlayTextComponent', () => {
  let component: OverlayTextComponent;
  let fixture: ComponentFixture<OverlayTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverlayTextComponent]
    });
    fixture = TestBed.createComponent(OverlayTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
