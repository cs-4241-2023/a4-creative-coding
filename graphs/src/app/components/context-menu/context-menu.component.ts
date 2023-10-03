import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {

  @Input() position = { x: 0, y: 0 };
  isVisible = false;

  onOption1Click() {
    alert('Option 1 clicked');
    this.hide();
  }

  onOption2Click() {
    alert('Option 2 clicked');
    this.hide();
  }

  show(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

}
