import { Injectable } from '@angular/core';
import { Displayable } from '../model/displayable';
import { InteractionService } from './interaction.service';
import { Edge } from '../model/edge';
import { Node } from '../model/node';

@Injectable({
  providedIn: 'root'
})
export class EditPanelService {

  constructor(private interactionService: InteractionService) { }

  getActiveModel(): Displayable | undefined {


    const selected = this.interactionService.getSelectedObjects();

    // only display edit panel if exactly one object is selected
    if (selected.size !== 1) {
      return undefined;
    }

    // get the selected object
    const model = Array.from(selected)[0].getModel();

    if (!model) {
      return undefined;
    }

    if (model instanceof Node) return model as Node;
    if (model instanceof Edge) return model as Edge;

    return undefined;
  }

}
