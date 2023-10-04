import { Coord } from "./coord";
import { Displayable } from "./displayable";
import { Graph } from "./graph";
import { Node } from "./node";

/*
Part of the graph model. Stores the start and end nodes of an edge. Edge can be undirected or directed
*/

export class Edge implements Displayable {

    public name: string = "";

    constructor(public id: number,
        public startNodeID: number,
        public endNodeID: number,
        public isDirected: boolean = false
        ) {}

    public getStartNode(graph: Graph): Node {
        return graph.getNode(this.startNodeID);
    }

    public getEndNode(graph: Graph): Node {
        return graph.getNode(this.endNodeID);
    }

    public getDisplayID(): string {
        return "Edge(" + this.id + ")";
    }


}