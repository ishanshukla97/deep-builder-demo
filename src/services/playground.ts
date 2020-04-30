import { SymbolicTensor } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import toposort from "toposort";

import { mappings } from "../tf-bindings"
import { buildGraph } from "../utils/graph";
import { DiagramApplication } from "../utils/playground";

export interface TensorflowIntermediateModelNode {
    id: string;
    ops: string;
    args: object;
    edges: string[];
    inputs: string[];
}

interface TensorflowModelNode extends TensorflowIntermediateModelNode {
    outputs?: SymbolicTensor
}

export const generateTFModel = (model: TensorflowIntermediateModelNode[]) => {
    const graph = buildGraph(model);
    /* Generate dependency list of nodes */
    const depList = toposort(graph);

    /* Convert JSON graph array to object for constant time complexity */
    let graphObj: Record<string, TensorflowModelNode> = {};
    model.map(item => { 
        graphObj[item.id] = item;
    });
    
    /* Generate output tensors of all nodes(using layers.apply()) */
    for (const nodeId of depList) {
        const node = graphObj[nodeId];

        if (nodeId === "output") {
            for (const inNode of node.inputs) {
                graphObj[nodeId].outputs = graphObj[inNode].outputs;
            }
            break;
        }

        if (!node.inputs.length) {
            graphObj[nodeId].outputs = mappings[node.ops](node.args);
        } else {
            // gather inputs from nodes
            const inputs = [];

            for (const prevNode of node.inputs) {
                inputs.push(graphObj[prevNode].outputs);
            }

            graphObj[nodeId].outputs = mappings[node.ops](node.args).apply(inputs);
        }
    }
 
    const inputIds = Object.keys(graphObj).filter((item) => graphObj[item].inputs.length === 0);
    const outputIds = Object.keys(graphObj).filter((item) => graphObj[item].edges.length === 0);

    const inputTensors = inputIds.map((item) => graphObj[item].outputs);
    const outputTensors = outputIds.map((item) => graphObj[item].outputs);

    if (inputTensors && outputTensors) {
        // @ts-ignore
        const tfModel = tf.model({ inputs: inputTensors, outputs: outputTensors });

        return {tfModel, graphObj};
    }
}

export const parseGraph = async (diagramApp: DiagramApplication) => {
    /**
     * This function parses Diagram Nodes to a format that
     * is accepted by gql server
     */
    const links = diagramApp.getActiveDiagram().getLinks();
    let isInputNodeAdded: boolean = false;
    
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
            //@ts-ignore
            if (srcOptions.name === "input" || trgOptions.name === "input")
                isInputNodeAdded = true;
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

    if (!isInputNodeAdded) {
        return false;
    }
    
    /* Convert object to array and stringify */
    return Object.values(nodes);
}

export const downloadTfModelJson = async (model: tf.LayersModel) => {
    try {
        const saveResult = await model.save('downloads://mymodel');
        return saveResult;
    } catch (e) {
        return false;
    }
}

export {
    tf
}
