import * as SRD from "@projectstorm/react-diagrams";
import { DeleteItemsAction } from "@projectstorm/react-canvas-core";
import { NodeFactory } from "./ModelBuilder/Node/NodeFactory"

export default class Application {
    protected activeModel: any;
    protected diagramEngine: SRD.DiagramEngine;

    constructor () {
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