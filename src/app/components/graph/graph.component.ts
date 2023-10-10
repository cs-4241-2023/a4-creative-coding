import { Component } from '@angular/core';
import { ClickCapture, ClickCaptureID } from 'src/app/interaction/click-capture';
import { CreateNodeCapture } from 'src/app/interaction/create-node-capture';
import { Coord } from 'src/app/model/coord';
import { Edge } from 'src/app/model/edge';
import { Node } from 'src/app/model/node';
import { InteractionService } from 'src/app/services/interaction.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: '[app-graph]',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  constructor(public stateService: StateService, private interactorService: InteractionService) {
    console.log("GraphComponent.constructor");
  }

  public getNodes(): Node[] {
    return this.stateService.getGraph().getNodes();
  }

  public getEdges(): Edge[] {
    return this.stateService.getGraph().getEdges();
  }

  public isDrawNewNodeLine(): boolean {
    return this.interactorService.getClickCaptureID() === ClickCaptureID.CREATE_NODE;
  }

  public getNewNodeLineStart(): Coord {
    let capture = this.interactorService.getClickCapture() as CreateNodeCapture;
    return capture.getNodePosition();
  }

  public getNewNodeLineEnd(): Coord {
    return this.interactorService.getMousePos();
  }
}
