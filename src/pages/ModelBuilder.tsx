import React, { useState, useReducer } from "react";
import { Container } from "semantic-ui-react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";

import Playground from "../components/PlaygroundWidget"
import { DiagramApplication } from "../services/ModelBuilder/playground"
import { OpsWidget } from "../components/OpsWidget";
import { NodeModel } from "../components/Node/NodeModel";
import { ModelBuilderReducer, IModelBuilderState } from "../services/ModelBuilder"
import { CustomLoader as Loader } from "../components/Loader";
import { generateTFModel, TensorflowIntermediateModelNode } from "../tf-bindings"
import ops from "../tf-bindings/ops";

interface IModelBuilderComponentProps {
    
}
interface IModelBuilderComponentState {
    update: boolean;
    isLoading: boolean;
}

const ModelBuilder: React.FC<IModelBuilderComponentProps> = (props) => {
    const diagramApp: DiagramApplication = DiagramApplication.getInstance();
    const [state, setState] = useState<IModelBuilderComponentState>({ 
        update: false, 
        isLoading: false 
    });
    const [{ nodes }, dispatch] = useReducer(ModelBuilderReducer, { nodes: [] })

    const forceRender = () => {
        setState({ ...state, update: !state.update });
    }

    const addNode = async (name: string, args: any, event: any) => {
        let node: NodeModel;
        node = new NodeModel({name, args});

        let point = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
        node.setPosition(point);
        diagramApp.getDiagramEngine().getModel().addNode(node);
        
        /**
         * Use state from reducer to check if isLoading. This is because
         * when link label update is performed then tfGraph is analyzed
         * outside of this component scope. Hence this component cannot know 
         * if tfGraph is finished analyzing. 
         * 
         * 1) Dispatch action UPDATE_LINK_LABEL and isLoading true
         * 2) someVar = parseGraph
         * 3) Pass someVar to tfGraph analyzing utility.
         * 4) await analyzing
         * 5) Dispatch action isLoading false
         */

        forceRender();
        setState({ ...state, isLoading: true })
        const intermediateModel = await parseGraph();
        const model = generateTFModel(intermediateModel)
        setState({ ...state, isLoading: false })
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
    const  parseGraph = async () => {
        /**
         * This function parses Diagram Nodes to a format that
         * is accepted by gql server
         */
        const links = diagramApp.getActiveDiagram().getLinks();
        
        const edges: [TensorflowIntermediateModelNode, TensorflowIntermediateModelNode][] = [];

        links.forEach(link => {
            const src = link.getSourcePort().getParent();
            const trg = link.getTargetPort().getParent();
            const srcOptions = src.getOptions()
            const trgOptions = trg.getOptions();
            if (srcOptions.id && trgOptions.id) {
                const node1 = {
                    id: srcOptions.id,
                    //@ts-ignore
                    ops: srcOptions.name,
                    //@ts-ignore
                    args: src.args,
                    inputs: [],
                    edges: []
                }

                const node2 = {
                    id: trgOptions.id,
                    //@ts-ignore
                    ops: trgOptions.name,
                    //@ts-ignore
                    args: trg.args,
                    inputs: [],
                    edges: []
                }
                edges.push([node1, node2]);
            }
        });

        /*
         * 1) Get all nodes.
         * 2) For all edges add node ids to input and output
         *      example: edge -> [node["1"], node["2"]], 
         *               add node["1"].edges = node["2"],
         *               add node["2"].inputs = [node["1"]]
         */
        let nodes: Record<string, TensorflowIntermediateModelNode> = {};

        edges.forEach((edge: [TensorflowIntermediateModelNode, TensorflowIntermediateModelNode]) => {
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
        console.log(nodes, "parseGraph");
        
        return Object.values(nodes);
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
            renderLoader={() => <Loader isActive={state.isLoading} size="tiny" label="Analyzing" />}
        />
    </Container>
}

export default ModelBuilder;