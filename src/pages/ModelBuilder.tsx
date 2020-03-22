import React, { useState } from "react";
import { Container } from "semantic-ui-react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";

import Playground from "../components/PlaygroundWidget"
import { DiagramApplication } from "../services/playground"
import { OpsWidget } from "../components/OpsWidget";
import { NodeModel } from "../components/Node/NodeModel";
import ops from "../tf-bindings/ops";

interface IModelBuilderProps {
    
}
interface IModelBuilderState {
    update: boolean;
}

const ModelBuilder: React.FC<IModelBuilderProps> = (props) => {
    const diagramApp: DiagramApplication = DiagramApplication.getInstance();
    const [state, setState] = useState<IModelBuilderState>({ update: false });

    const forceRender = () => {
        setState({ ...state, update: !state.update });
    }

    const addNode = (name: string, args: any, event: any) => {
        let node: NodeModel;
        node = new NodeModel({name, args});

        let point = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
        node.setPosition(point);
        diagramApp.getDiagramEngine().getModel().addNode(node);
        
        forceRender();
    }
    const addPresetModel = (data: any) => {
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
            diagramApp.getDiagramEngine().getModel().addNode(node);

            presetToCurrentId[id] = node;
        });

        links.forEach((linkTuple: any) => {
            const [srcId, trgId] = linkTuple;
            /**
             * Get src, trg node of current graph using presetToCurrent map
             */
            const srcNode = presetToCurrentId[srcId]
            const trgNode = presetToCurrentId[trgId]
            const srcPort = srcNode.getOutPorts()[0];
            const trgPort = trgNode.getInPorts()[0];

            if (srcPort && trgPort) {
                const link = srcPort.link(trgPort)
                diagramApp.getDiagramEngine().getModel().addAll(link);
            }
        })
        forceRender();
        return;
    }
    return <Container fluid>
        <Playground
            renderAvailableOps={() => <OpsWidget availableOps={ops} />} 
            handleAddNode={addNode}
            handleAddPresetModel={addPresetModel}
            renderCanvasWidget={(className?: string) => (<CanvasWidget 
                engine={diagramApp.getDiagramEngine()} 
                className={className} 
            />)}
        />
    </Container>
}

export default ModelBuilder;