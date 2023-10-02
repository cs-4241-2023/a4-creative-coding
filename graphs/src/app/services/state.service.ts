import { Injectable } from '@angular/core';
import { Graph } from '../model/graph';

/*
Stores the global state of the application. This is a singleton service.
Handles syncing client with server state, and undo/redo.
*/

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private graph: Graph;

  constructor() {
    console.log("StateService constructor");
    this.graph = new Graph();
  }

  public getGraph(): Graph {
    return this.graph;
  }

}
