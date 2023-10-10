import { Coord } from "./coord";
import { Graph } from "./graph";
import { IDHolder } from "./id-holder";
import { Node } from "./node";

/*
Part of the graph model. Stores the start and end nodes of an edge. Edge can be undirected or directed
*/

export class Edge implements IDHolder {

    constructor(public id: number,
        public startNodeID: number,
        public endNodeID: number,
        ) {}

    public getStartNode(graph: Graph): Node {
        return graph.getNode(this.startNodeID);
    }

    public getEndNode(graph: Graph): Node {
        return graph.getNode(this.endNodeID);
    }


}