import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Node } from 'src/app/model/node';
import { AbstractInteractiveComponent } from '../abstract-interactive/abstract-interactive.component';
import { Interactor } from 'src/app/interaction/interactor';
import { NodeInteractor } from 'src/app/interaction/node-interactor';
import { StateService } from 'src/app/services/state.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { ClickCaptureID } from 'src/app/interaction/click-capture';
import { CreateNodeCapture } from 'src/app/interaction/create-node-capture';
import { SaveService } from 'src/app/services/save.service';


@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent extends AbstractInteractiveComponent {

  @Input() node!: Node;

  constructor(public override interactionService: InteractionService,
    private stateService: StateService,
    private saveService: SaveService) {
    super(interactionService);
  }

  override registerInteractor(): Interactor {
    return new NodeInteractor(this.node, this.stateService, this.interactionService, this.saveService);
  }

  public getX(): number {
    return this.node!.pos.x;
  }

  public getY(): number {
    return this.node!.pos.y;
  }

  public getRadius(): number {
    return 20;
  }

  public getColor(): string {
    return "blue";
  }

  public getStrokeWidth(): number {
    if (this.isCreateNodeCaptureAndHoveringOverThisNode()) {
      return 6;
    } else if (this.getInteractor().isSelected) {
      return 4;
    }
    return 1;
  }

  // whether in create node click capture mode, and the mouse is hovering over this node
  public isCreateNodeCaptureAndHoveringOverThisNode(): boolean {
    if (this.interactionService.getClickCaptureID() === ClickCaptureID.CREATE_NODE) {
      let capture = this.interactionService.getClickCapture() as CreateNodeCapture;
      return capture.getHoveringNode() === this.node;
    }
    return false;
  }
}
