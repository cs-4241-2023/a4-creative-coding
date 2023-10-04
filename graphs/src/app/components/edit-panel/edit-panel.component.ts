import { Component, OnInit } from '@angular/core';
import { Pane } from 'tweakpane';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.css']
})
export class EditPanelComponent implements OnInit {

  constructor() {
    
  }

  ngOnInit(): void {
    return;
    const PARAMS = {
      factor: 123,
      title: 'hello',
      color: '#ff0055',
    };
    
    const pane = new Pane();
    
    pane.addBinding(PARAMS, 'factor');
    pane.addBinding(PARAMS, 'title');
    pane.addBinding(PARAMS, 'color');
  }

}
