import React, { useState, useEffect, useRef } from "react";
import { Container } from "semantic-ui-react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import { toast, ToastOptions } from "react-toastify";

/* Import components */
import { PlaygroundWidget } from "../components/PlaygroundWidget"
import { OpsWidget } from "../components/OpsWidget";
import { NodeModel } from "../components/Node/NodeModel";
import { CustomLoader as Loader } from "../components/Loader";
import { PresetWidget } from "../components/PresetsWidget";
import { PropertyPane } from "../components/PropertyPane";

/* Import services */
import { generateTFModel, parseGraph, tf } from "../services/playground"

/* Import utilities */
import { DiagramApplication, attachListenerToNode } from "../utils/playground"

/* Import static content */
import ops from "../static/ops";
import presets from "../static/presets.json";
import { useHistory } from "react-router-dom";

interface IModelBuilderComponentProps {
    
}
interface IModelBuilderComponentState {
    forceUpdate: boolean;
    isLoading: boolean;
    model?: tf.LayersModel;
    error?: {
        message: string;
        type: string;
    };
};
interface ISelectedNodeState {
    node?: {
        name: string;
        type: string;
        sub_type?: string;
        value: any;
    }[];
    id?: string;
}
 
const toastErrorSettings: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
}

const ModelBuilder: React.FC<IModelBuilderComponentProps> = (props) => {
    const diagramApp: DiagramApplication = DiagramApplication.getInstance();
    const history = useHistory();

    const [state, setState] = useState<IModelBuilderComponentState>({ 
        forceUpdate: false, 
        isLoading: false,
        error: {
            message: "",
            type: ""
        },
    });
    const [selectedNode, setSelectedNode] = useState<ISelectedNodeState>({
        node: undefined,
        id: undefined
    });
    const prevSelectedNode = usePrevious(selectedNode);

    useEffect(() => {
        try {
            if (state.error?.type === "Error") {
                toast.error(state.error.message, toastErrorSettings);
            } else if (state.error?.type === "TypeError") {
                toast.error("Oops! An unknown error occured.", toastErrorSettings);
            }
        } catch (e) {
            return;
        }
    }, [state.error]);
    useEffect(() => {
        if (prevSelectedNode) {
            const {node, id} = prevSelectedNode;
            if (id) {
                const diagNode = (diagramApp.getActiveDiagram().getNode(id) as NodeModel);
                if (!diagNode)  return;
                let newArgs: Record<string, any> = {};
                node?.forEach(item => {
                    if (item.value !== "") {
                        newArgs[item.name] = item.value;
                    }
                });
                diagNode.setArgs(newArgs);
                forceRender();
            }
        }
    }, [selectedNode.id])

    const forceRender = () => {
        diagramApp.getDiagramEngine().repaintCanvas()
        setState({ ...state, forceUpdate: !state.forceUpdate });
    }

    const handleArgChange = (type: string, value: any) => {
        if (selectedNode.node) {
            const newSelectedNode = selectedNode.node.map(arg => {
                if (arg.name === type) {
                    return { ...arg, value };
                }
                return { ...arg };
            });
            
            setSelectedNode({ ...selectedNode, node: newSelectedNode });
        }
    }

    /**
     * This function is registered as a listener to each and every node. It is invoked when 
     * an event occurs with the respective node. It performs two jobs
     * 1) finds the previously selected node in the diagram engine
     *      If the the user has set some layer property by selecting/typing, then,
     *      updates the respective node's arg property with the new values
     * 2) Gets the newly selected node and checks if there are any property set by the user.
     *      If any property is found, then, Glue together argument metadata with the previously
     *      set properties into one object.
     *      Sets the state of component with the newly selected args and values.
     * @param arg this object is auto created by react diagrams and contains 'entity' property which
     * is the node selected by the user.
     */
    
    const selectionChangeListener = (arg: any) => {
        if (arg.function === "selectionChanged") {
            if (!arg.isSelected) {
                setSelectedNode({ node: undefined, id: undefined });
                return;
            }
            const previousArgValues = Object.entries(arg.entity.args);
            const layerArgsWithValues = arg.entity.getOptions().args.map((arg: any) => {
                const prevValue = previousArgValues.filter(keyVal => (keyVal[0] === arg.name))[0];
                
                if (prevValue) {
                    return { ...arg, value: prevValue[1] };
                }
                return { ...arg, value: "" };
            });
            setSelectedNode({ node: layerArgsWithValues, id: arg.entity.options.id });
            return;
        }
    } 

    const addNode = async (name: string, args: any, color: string, event: any) => {
        let node: NodeModel;
        node = new NodeModel({name, args, color});

        let point = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
        node.setPosition(point);
        diagramApp.getDiagramEngine().getModel().addNode(node);
        
        /**@todo When a node is added all other nodes should be deselected and those added should 
         * be preselected. Call setState here so the closure of selectionchangeListener has updated state.
         */
        
        attachListenerToNode(node, selectionChangeListener);
        triggerTFGraphAnalyzer();
        forceRender();
    }

    const triggerTFGraphAnalyzer = async(download: boolean = false) => {
        try {
            setState({ ...state, isLoading: true })
            const intermediateModel = await parseGraph(diagramApp);

            if (!intermediateModel) return;

            const modelResult = generateTFModel(intermediateModel);
            
            if (download) {
                const downloadResult = await modelResult
                ?.tfModel
                .save('downloads://mymodel');
            }

            populateLinkLabels(modelResult?.graphObj)
        } catch (e) {
            if (e.message !== state.error?.message) {
                setState({ ...state, error: { message: e.message, type: e.name }});
            }
            return;
        } finally {
            setState({ ...state, isLoading: false});
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
        /**When links are removed and added again to diagram
         * they do not appear at the correct place. This is a
         * bug. Selecting each node makes them appear at their 
         * respective places again. 
         * ***************This is a quick fix****************
         */
        const nodes = diagramApp.getActiveDiagram().getNodes();
        for (const node of nodes) {
            node.setSelected(true);
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
            const { name, args, options, x, y, id } = nodePreset;
            
            const node = new NodeModel({ name, 
                args: options.args, 
                color: options.color,
                defaultArgs: args 
            });
            node.setPosition(x, y);
            node.setSelected(true);
            diagramApp.getDiagramEngine().getModel().addNode(node);
            attachListenerToNode(node, selectionChangeListener);
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
        
    }

    const handleDownload = () => {
        triggerTFGraphAnalyzer(true)
    }
    
    return <Container fluid>
        <PlaygroundWidget
            renderAvailableOps={() => <OpsWidget availableOps={ops} />} 
            renderAvailablePresets={() => <PresetWidget presets={presets} />}
            renderPropertyPane={() => <PropertyPane onChange={handleArgChange} layerProps={selectedNode.node} />}
            handleAddNode={addNode}
            handleAddPresetModel={addPresetModel}
            renderCanvasWidget={(className?: string) => (<CanvasWidget 
                engine={diagramApp.getDiagramEngine()} 
                className={className} 
            />)}
            renderLoader={() => <Loader isActive={state.isLoading} size="tiny" label="Analyzing" />}
            addPreset={addPreset}
            onDownload={handleDownload}
            onClickFaq={() => history.push('/faq')}
        />
    </Container>
}

export default ModelBuilder;

const usePrevious = <T extends {}>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}