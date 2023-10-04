import { Component } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent {

  constructor(private interactionService: InteractionService) {
    
  }

  public getObjects(): string {
    return this.interactionService.getObjectDebug().toString();
  }

  public getSelected(): string {
    return this.interactionService.getSelectedDebug().toString();
  }

  public isDragging(): string {
    return this.interactionService.getDragging().toString();
  }

}
