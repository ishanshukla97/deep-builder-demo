import React from "react";
import { OpsWidget } from "../OpsWidget";
import { DiagramApplication } from "../../DiagramApplication";
import { NodeModel } from "../Node/NodeModel";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import "./index.scss";
import { DefaultPortModel } from "@projectstorm/react-diagrams";

export interface PlaygroundWidgetProps {
    app: DiagramApplication;
    renderAvailableOps: () => any
}
export interface PlaygroundWidgetState {
    isParsing: boolean;
    isAdding: boolean;
    modelName: string;
}

export default class PlaygroundWidget extends React.Component<PlaygroundWidgetProps, PlaygroundWidgetState> {
    constructor (props: PlaygroundWidgetProps) {
        super(props);
        this.state = { 
            isParsing: false, 
            isAdding: false,
            modelName: ""
        }
        this.handleDrop = this.handleDrop.bind(this);
    }

    handleDrop (event: any) {
        if (event.dataTransfer.getData('ops-node')) {
            const data = JSON.parse(event.dataTransfer.getData('ops-node'));
            
            let node: NodeModel;
            node = new NodeModel({name: data.name, args: data.args});
    
            let point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
            node.setPosition(point);
            this.props.app.getDiagramEngine().getModel().addNode(node);
            
            this.forceUpdate();
            return;
        }
        let data = JSON.parse(event.dataTransfer.getData('model-node'));
        if (data.data)  data = JSON.parse(data.data)
        
        /**
         * 1) Get links and nodes from preset model object
         * 2) Add all the nodes to graph using model.addNode()
         * 3) For every node check if it has links, get the corresponding
         *      in and out ports of source and target respectively
         * 4) Add link between source and target port using srcPort.add(trgPort)
         */
        const nodes: any = [];
        const links: any = [];
        let presetToCurrentId: any = {};

        Object.keys(data.layers[1].models).forEach(nodeId => {
            nodes.push(data.layers[1].models[nodeId])
        });
        Object.keys(data.layers[0].models).forEach(linkId => {
            const link = data.layers[0].models[linkId];

            const linkTuple = [link.source, link.target];
            links.push(linkTuple)
        });

        nodes.forEach((nodePreset: any) => {
            const { name, args, options, x, y, id } = nodePreset
            const node = new NodeModel({ name, args: options.args, defaultArgs: args });
            node.setPosition(x, y);
            node.setSelected(true);
            this.props.app.getDiagramEngine().getModel().addNode(node);

            presetToCurrentId[id] = node;
        });

        links.forEach((linkTuple: any) => {
            const [srcId, trgId] = linkTuple;
            /**
             * Get src, trg node of current graph using presetToCurrent map
             */
            const srcNode = presetToCurrentId[srcId]
            const trgNode = presetToCurrentId[trgId]
            const srcPort: DefaultPortModel = srcNode.getOutPorts()[0];
            const trgPort = trgNode.getInPorts()[0];

            if (srcPort && trgPort){
                const link = srcPort.link(trgPort)
                this.props.app.getDiagramEngine().getModel().addAll(link);
                this.forceUpdate()
            }
        })
        
        return;
    }

    async parseGraph (client?: any) {
        /**
         * This function parses Diagram Nodes to a format that
         * is accepted by gql server
         */
        const links = this.props.app.getActiveDiagram().getLinks();
        
        const edges: any = [];

        links.forEach(link => {
            const node1 = {
                id: link.getSourcePort().getParent().getOptions().id,
                //@ts-ignore
                ops: link.getSourcePort().getParent().getOptions().name,
                //@ts-ignore
                args: link.getSourcePort().getParent().args
            }
            const node2 = {
                id: link.getTargetPort().getParent().getOptions().id,
                //@ts-ignore
                ops: link.getTargetPort().getParent().getOptions().name,
                //@ts-ignore
                args: link.getTargetPort().getParent().args
            }
            edges.push([node1, node2]);
        });

        /*
         * 1) Get all nodes.
         * 2) For all edges add node ids to input and output
         *      example: edge -> [node["1"], node["2"]], 
         *               add node["1"].edges = node["2"],
         *               add node["2"].inputs = [node["1"]]
         */
        let nodes: any = {};

        edges.forEach((edge: any) => {
            const [srcNode, trgNode] = edge;

            if (!nodes[srcNode.id]) {
                nodes[srcNode.id] = { ...srcNode };
            }
            if (nodes[srcNode.id].edges) {
                nodes[srcNode.id].edges.push(trgNode.id);
            } else {
                nodes[srcNode.id].edges = [trgNode.id];
            }
            if (!nodes[srcNode.id].inputs)   nodes[srcNode.id].inputs = []

            if (!nodes[trgNode.id]) {
                nodes[trgNode.id] = { ...trgNode };
            }
            if (nodes[trgNode.id].inputs) {
                nodes[trgNode.id].inputs.push(srcNode.id);
            } else {
                nodes[trgNode.id].inputs = [srcNode.id];
            }
            if (!nodes[trgNode.id].edges)   nodes[trgNode.id].edges = []
        });
        
        /* Convert object to array and stringify */
        const nodeVals = Object.values(nodes);
        const stringfiedNodes = JSON.stringify(nodeVals);

        return stringfiedNodes;
    }

    render () {
        return (
            <div className="playground-widget">
                <div className="playground-widget__header">Playground widget Header</div>
                <div className="playground-widget__container">
                    { this.props.renderAvailableOps() }
                    <div
                        onDrop={this.handleDrop}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                        className="playground-widget__content"
                    >
                        <CanvasWidget 
                            engine={this.props.app.getDiagramEngine()}
                            className="playground-widget--canvas-wrapper" 
                        />
                    </div>
                </div>
            </div>
        )
    }
}