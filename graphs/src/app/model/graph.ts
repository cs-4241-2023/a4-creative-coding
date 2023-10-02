import { Coord } from "./coord";
import { Edge } from "./edge";
import { IDHolder } from "./id-holder";
import { Node } from "./node";

/*
The graph model that stores the nodes and edges of the graph.
*/

export class Graph {

    private nodes: { [id: number] : Node} = [];
    private edges: { [id: number] : Edge} = [];

    constructor() {
        this.reset();
    }

    /*
    PRIVATE METHODS
    */

    private addEdge(edge: Edge) {
        this.edges[edge.id] = edge;
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

    private addNode(node: Node) {
        this.nodes[node.id] = node;
    }

    /*
    PUBLIC FACING METHODS THAT MODIFY THE GRAPH
    */

    // sets graph to a singular node with no edges
    public reset() {
        this.nodes = [];
        this.edges = [];

        this.addNode(this.constructNode(new Coord(0, 0)));

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

}