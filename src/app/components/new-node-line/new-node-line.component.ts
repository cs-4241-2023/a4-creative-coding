import { Component, Input } from '@angular/core';
import { Coord } from 'src/app/model/coord';

@Component({
  selector: '[app-new-node-line]',
  templateUrl: './new-node-line.component.html',
  styleUrls: ['./new-node-line.component.css']
})
export class NewNodeLineComponent {
@Input() start!: Coord;
@Input() end!: Coord;

}
