import { Component } from '@angular/core';
import { Edge } from 'src/app/model/edge';
import { Node } from 'src/app/model/node';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: '[app-graph]',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  constructor(public stateService: StateService) {
    console.log("GraphComponent.constructor");
  }

  public getNodes(): Node[] {
    return this.stateService.getGraph().getNodes();
  }

  public getEdges(): Edge[] {
    return this.stateService.getGraph().getEdges();
  }

}
