import React, { useState, useReducer, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { toast, ToastOptions } from "react-toastify";

import {PlaygroundWidget} from "../components/PlaygroundWidget"
import { DiagramApplication } from "../services/ModelBuilder/playground"
import { OpsWidget } from "../components/OpsWidget";
import { NodeModel } from "../components/Node/NodeModel";
import { CustomLoader as Loader } from "../components/Loader";
import { generateTFModel, TensorflowIntermediateModelNode } from "../tf-bindings"
import ops from "../tf-bindings/ops";
import { DefaultLinkModel } from "@projectstorm/react-diagrams";

interface IModelBuilderComponentProps {
    
}
interface IModelBuilderComponentState {
    forceUpdate: boolean;
    isLoading: boolean;
    error?: string;
}

const toastErrorSettings: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
}

const ModelBuilder: React.FC<IModelBuilderComponentProps> = (props) => {
    const diagramApp: DiagramApplication = DiagramApplication.getInstance();

    const [state, setState] = useState<IModelBuilderComponentState>({ 
        forceUpdate: false, 
        isLoading: false,
        error: ""
    });

    useEffect(() => {
        try {
            if (state.error) {
                toast.error(state.error, toastErrorSettings);
            }
        } catch (e) {
            return;
        }
    }, [state.error])

    const forceRender = () => {
        diagramApp.getDiagramEngine().repaintCanvas()
        setState({ ...state, forceUpdate: !state.forceUpdate });
    }

    const addNode = async (name: string, args: any, color: string, event: any) => {
        let node: NodeModel;
        node = new NodeModel({name, args, color});

        let point = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
        node.setPosition(point);
        diagramApp.getDiagramEngine().getModel().addNode(node);

        triggerTFGraphAnalyzer();
        forceRender();
    }

    const triggerTFGraphAnalyzer = async() => {
        try {
            setState({ ...state, isLoading: true })
            const intermediateModel = await parseGraph();
            const [tfModel, graph] = generateTFModel(intermediateModel);
            populateLinkLabels(graph)
            setState({ ...state, isLoading: false })
        } catch (e) {
            if (e.message !== state.error) {
                setState({ ...state, error: e.message});
            }
            setState({ ...state, isLoading: false});
            return;
        }
    }

    const populateLinkLabels = async (graph: any) => {
        const ids = Object.keys(graph)
        for (const nodeId of ids) {
            const node = diagramApp.getActiveDiagram().getNode(nodeId);
            if (node) {
                const port = node.getPort("out");
                if (port) {
                    const linkIds = Object.keys(port.getLinks());
                    const linksObj = port.getLinks();
                    
                    for (const id of linkIds) {
                        const newLabel = "???" + graph[nodeId].outputs.shape.toString();
                        //Remove previous label before adding new ones
                        const srcPort = (linksObj[id] as DefaultLinkModel).getSourcePort();
                        const trgPort = (linksObj[id] as DefaultLinkModel).getTargetPort();
                        (linksObj[id] as DefaultLinkModel).remove();
                        const newLink = new DefaultLinkModel()
                        newLink.setTargetPort(trgPort);
                        newLink.setSourcePort(srcPort);
                        newLink.addLabel(newLabel);
                        diagramApp.getActiveDiagram().addLink(newLink);
                    }
                }
            }
        }
        
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
        return Object.values(nodes);
    }
    
    const addPreset = async (name: string) => {
        const currentModel = diagramApp.getDiagramEngine().getModel().serialize();
        const stringifiedModel = await JSON.stringify(currentModel);
        const modelInput = { model: stringifiedModel, name }
        console.log(modelInput);
        
    }
    return <Container fluid>
        <PlaygroundWidget
            renderAvailableOps={() => <OpsWidget availableOps={ops} />} 
            handleAddNode={addNode}
            handleAddPresetModel={addPresetModel}
            renderCanvasWidget={(className?: string) => (<CanvasWidget 
                engine={diagramApp.getDiagramEngine()} 
                className={className} 
            />)}
            renderLoader={() => <Loader isActive={state.isLoading} size="tiny" label="Analyzing" />}
            addPreset={addPreset}
        />
    </Container>
}

export default ModelBuilder;