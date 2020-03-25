import { mappings as actMap } from "./activation";
import { mappings as basicMap } from "./basic";
import { mappings as convMap } from "./convolutional";
import { mappings as mergeMap } from "./merge";
import { mappings as poolingMap } from "./pooling";

import { buildGraph } from "../utils/graph";

export interface TensorflowIntermediateModelNode {
    id: string;
    ops: string;
    args: object;
    edges: string[];
    inputs: string[];
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
    // const depList = toposort(graph);

    // /* Convert JSON graph array to object for constant time complexity */
    // console.log("generateTfModel");
    
    // /* Generate output tensors of all nodes(using layers.apply()) */
    // for (const nodeId of depList) {
    //     const node = model.filter(node => (node.id === nodeId))
    //     console.log(node);
    // }
    return;
}

