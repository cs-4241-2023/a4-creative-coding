import { Component, Input, OnInit } from '@angular/core';
import { Node } from 'src/app/model/node';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit{

  @Input() node!: Node;

  constructor() {

  }

  ngOnInit(): void { // node is guaranteed to exist by the time this is called
    
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

}
