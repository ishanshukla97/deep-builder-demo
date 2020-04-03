import React, { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import { toast, ToastOptions } from "react-toastify";

/* Import components */
import { PlaygroundWidget } from "../components/PlaygroundWidget"
import { OpsWidget } from "../components/OpsWidget";
import { NodeModel } from "../components/Node/NodeModel";
import { CustomLoader as Loader } from "../components/Loader";

/* Import services */
import { generateTFModel, parseGraph } from "../services"
import { DiagramApplication } from "../services/playground"

/* Import static content */
import ops from "../static/ops";


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
            const intermediateModel = await parseGraph(diagramApp);

            if (!intermediateModel) return;

            const [tfModel, graph] = generateTFModel(intermediateModel);
            populateLinkLabels(graph)
            setState({ ...state, isLoading: false })
        } catch (e) {
            console.log(e, "e");
            
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