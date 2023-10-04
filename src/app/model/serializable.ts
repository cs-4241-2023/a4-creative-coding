export interface Serializable {
    serialize(): any;
    deserialize(input: any): void;
}