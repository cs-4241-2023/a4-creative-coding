import { Component, Input } from '@angular/core';
import { Node } from 'src/app/model/node';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent {

  @Input() node: Node | undefined;

  constructor() {

  }

  public exists(): boolean {
    console.log("node", this.node);
    return this.node !== undefined;
  }

  public getX(): number {
    return this.node!.pos.x;
  }

  public getY(): number {
    return this.node!.pos.y;
  }

  public getRadius(): number {
    return 5;
  }

  public getColor(): string {
    return "blue";
  }

}
