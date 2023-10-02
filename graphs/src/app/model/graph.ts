import { Coord } from "./coord";
import { Edge } from "./edge";
import { IDHolder } from "./id-holder";
import { Node } from "./node";
import { Serializable } from "./serializable";

/*
The graph model that stores the nodes and edges of the graph.
*/

export class Graph implements Serializable {

    private nodes: { [id: number] : Node} = [];
    private edges: { [id: number] : Edge} = [];

    private zoom: number = 1;
    private textSize: number = 12;
    private showGraph: boolean = true;

    constructor() {
        this.reset();
    }

    /*
    PRIVATE METHODS
    */

    private addNode(node: Node): Node {
        this.nodes[node.id] = node;
        return node;
    }

    private addEdge(edge: Edge): Edge {
        this.edges[edge.id] = edge;
        return edge;
    }

    // returns a unique id for a new node by finding the smallest nonzero integer not already used
    private getNewID(idHolders: IDHolder[]): number {
        let id = 0;
        while (idHolders.find(node => node.id == id)) {
            id++;
        }
        return id;

    }

    // given a position, construct a node object with unique id and return it
    private constructNode(pos: Coord): Node {
        return new Node(this.getNewID(this.getNodes()), pos);
    }

    // given two nodes, construct an edge object with unique id and return it
    private constructEdge(startNode: Node, endNode: Node): Edge {
        return new Edge(this.getNewID(this.getEdges()), startNode.id, endNode.id);
    }

    /*
    PUBLIC GETTERS
    */

    public getNode(id: number): Node {
        return this.nodes[id];
    }

    public getNodes(): Node[] {
        return Object.values(this.nodes);
    }

    public getEdge(id: number): Edge {
        return this.edges[id];
    }

    public getEdges(): Edge[] {
        return Object.values(this.edges);
    }

    /*
    PUBLIC FACING METHODS THAT MODIFY THE GRAPH
    */

    // sets graph to a singular node with no edges
    public reset() {
        this.nodes = [];
        this.edges = [];

        let node = this.addNode(this.constructNode(new Coord(50, 50)));
        this.generateNewNode(new Coord(200, 50), node);
        console.log(this);

    }

    // creates a new node at the specified position, with an edge connected to specified parent node
    // returns the new node
    public generateNewNode(pos: Coord, parent: Node): Node {
        let newNode = this.constructNode(pos);
        let newEdge = this.constructEdge(parent, newNode);

        this.addNode(newNode);
        this.addEdge(newEdge);

        return newNode;
    }

    /*
    SERIALIZATION
    */
    public serialize(): string {
        return JSON.stringify([this.nodes, this.edges, this.zoom, this.textSize, this.showGraph]);
    }

    public deserialize(json: string): void {
        let parsed = JSON.parse(json);
        this.nodes = parsed[0];
        this.edges = parsed[1];
        this.zoom = parsed[2];
        this.textSize = parsed[3];
        this.showGraph = parsed[4];
    }


}