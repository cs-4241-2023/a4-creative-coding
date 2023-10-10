import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNodeLineComponent } from './new-node-line.component';

describe('NewNodeLineComponent', () => {
  let component: NewNodeLineComponent;
  let fixture: ComponentFixture<NewNodeLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewNodeLineComponent]
    });
    fixture = TestBed.createComponent(NewNodeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
