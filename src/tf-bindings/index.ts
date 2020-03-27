import toposort from "toposort";
import * as tf from "@tensorflow/tfjs";

import { mappings as actMap } from "./activation";
import { mappings as basicMap } from "./basic";
import { mappings as convMap } from "./convolutional";
import { mappings as mergeMap } from "./merge";
import { mappings as poolingMap } from "./pooling";

import { buildGraph } from "../utils/graph";
import { SymbolicTensor } from "@tensorflow/tfjs";

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

export const mappings: any = {
    ...actMap,
    ...basicMap,
    ...convMap,
    ...mergeMap,
    ...poolingMap
};

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
        return [tfModel, graphObj];
    }
}

