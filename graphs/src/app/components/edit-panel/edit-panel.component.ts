import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Displayable } from 'src/app/model/displayable';
import { EditPanelService } from 'src/app/services/edit-panel.service';
import { Pane } from 'tweakpane';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.css']
})
export class EditPanelComponent implements OnInit, OnChanges {
@Input() model?: Displayable;

  private PANE_PARAMS = {
    displayID: "",
    name: "",
  }

  constructor(private editPanelService: EditPanelService) {
    
  }

  ngOnInit(): void {

    const pane = new Pane();

    let displayBinding = pane.addBinding(this.PANE_PARAMS, 'displayID', {readonly: true});
    let nameBinding = pane.addBinding(this.PANE_PARAMS, 'name', {readonly: false});
    
    // update model name when changed in edit panel
    nameBinding.on('change', (ev) => {
      let activeModel = this.editPanelService.getActiveModel();
      if (activeModel === undefined) return;
      activeModel.name = ev.value;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("on changes");
    let activeModel = this.editPanelService.getActiveModel();
    if (activeModel === undefined) return;

    this.PANE_PARAMS.displayID = activeModel.getDisplayID();
    this.PANE_PARAMS.name = activeModel.name;
  }

}
