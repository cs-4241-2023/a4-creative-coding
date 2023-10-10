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


    constructor() {
        console.log("Graph constructor");
        this.reset();
    }

    /*
    PRIVATE METHODS
    */

    private _addNode(node: Node): Node {
        this.nodes[node.id] = node;
        return node;
    }

    private _addEdge(edge: Edge): Edge {
        this.edges[edge.id] = edge;
        return edge;
    }

    private _deleteNode(node: Node): void {
        delete this.nodes[node.id];
    }

    private _deleteEdge(edge: Edge): void {
        delete this.edges[edge.id];
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

        let node = this._addNode(this.constructNode(new Coord(300, 300)));
        this.createNodeWithLink(new Coord(400, 400), node);
        console.log(this);

    }

    public createNode(pos: Coord): Node {
        let newNode = this.constructNode(pos);
        this._addNode(newNode);
        return newNode;
    }

    // creates a new node at the specified position, with an edge connected to specified parent node
    // returns the new node
    public createNodeWithLink(pos: Coord, parent: Node): Node {

        let node = this.createNode(pos);

        let newEdge = this.constructEdge(parent, node);
        this._addEdge(newEdge);

        return node;
    }

    // create a link between two nodes
    public createLink(startNode: Node, endNode: Node): Edge {

        let newEdge = this.constructEdge(startNode, endNode);
        this._addEdge(newEdge);

        return newEdge;
    }

    // delete node and any edges connected to it
    public deleteNode(node: Node): void {

        let edgesToDelete = this.getEdges().filter(edge => edge.startNodeID == node.id || edge.endNodeID == node.id);
        edgesToDelete.forEach(edge => this._deleteEdge(edge));

        this._deleteNode(node);

    }

    // delete edge
    public deleteEdge(edge: Edge): void {
        this._deleteEdge(edge);
    }

    /*
    SERIALIZATION
    */
    public serialize(): string {
        return JSON.stringify([this.nodes, this.edges]);
    }

    public deserialize(json: string): void {
        console.log("Deserializing", json);
        let parsed = JSON.parse(json);
        console.log(parsed);
        this.nodes = parsed[0].map((node: any) => {
            return new Node(node.id, new Coord(node.pos.x, node.pos.y), node.name);
        });
        this.edges = parsed[1].map((edge: any) => {
            return new Edge(edge.id, edge.startNodeID, edge.endNodeID);
        });
    }


}