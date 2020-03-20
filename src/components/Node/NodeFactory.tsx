import React from "react";
import { NodeModel } from "./NodeModel";
import { NodeWidget } from "./index";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

export class NodeFactory extends AbstractReactFactory<NodeModel, DiagramEngine> {
    constructor () {
        super('custom-node');
    }

    generateModel () {
        return new NodeModel();
    }

    generateReactWidget (event: any): JSX.Element {
        return <NodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
    } 
}