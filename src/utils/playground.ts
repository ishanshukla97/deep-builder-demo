import * as SRD from "@projectstorm/react-diagrams";
import { DeleteItemsAction } from "@projectstorm/react-canvas-core";

import { NodeFactory } from "../components/Node/NodeFactory"
import { NodeModel } from "../components/Node/NodeModel";

export class DiagramApplication {
    protected activeModel: SRD.DiagramModel
    protected diagramEngine: SRD.DiagramEngine;

    public static getInstance(): DiagramApplication {
        if (!DiagramApplication.instance) {
            DiagramApplication.instance = new DiagramApplication();
        }
        return DiagramApplication.instance;
    }
    private static instance: DiagramApplication;

    private constructor () {
        this.diagramEngine = SRD.default({ registerDefaultDeleteItemsAction: false });
        this.activeModel = new SRD.DiagramModel();
        this.newModel();
    }

    public newModel () {
        this.diagramEngine.getNodeFactories().registerFactory(new NodeFactory());
        this.diagramEngine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }))
        this.diagramEngine.setModel(this.activeModel);
    }

    public getActiveDiagram(): SRD.DiagramModel {
        return this.activeModel;
    }

    public getDiagramEngine(): SRD.DiagramEngine {
        return this.diagramEngine;
    }
}

export const attachListenerToNode = (node: NodeModel, listener: (args: any) => any) => {
    return node.registerListener({
        eventDidFire: listener
    });
}