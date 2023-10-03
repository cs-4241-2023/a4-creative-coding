import { Component, Input } from '@angular/core';
import { ContextMenuOption } from 'src/app/interaction/interactor';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {
  @Input() contextMenuOptions: ContextMenuOption[] = [];

}
