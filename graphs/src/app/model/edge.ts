import { Coord } from "./coord";
import { IDHolder } from "./id-holder";
import { Node } from "./node";

/*
Part of the graph model. Stores the start and end nodes of an edge. Edge can be undirected or directed
*/

export class Edge implements IDHolder {

    constructor(public id: number,
        public startNodeID: number,
        public endNodeID: number,
        public isDirected: boolean = false
        ) {}

}