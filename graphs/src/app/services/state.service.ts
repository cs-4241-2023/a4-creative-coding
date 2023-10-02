import { Injectable } from '@angular/core';
import { Graph } from '../model/graph';

/*
Stores the global state of the application. This is a singleton service.
*/

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private graph: Graph) { 


  }

  public getGraph(): Graph {
    return this.graph;
  }

}
