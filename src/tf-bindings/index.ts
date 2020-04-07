import { mappings as actMap } from "./activation";
import { mappings as basicMap } from "./basic";
import { mappings as convMap } from "./convolutional";
import { mappings as mergeMap } from "./merge";
import { mappings as poolingMap } from "./pooling";
import { mappings as batchNormalization } from "./normalization";


export const mappings: any = {
    ...actMap,
    ...basicMap,
    ...convMap,
    ...mergeMap,
    ...poolingMap,
    ...batchNormalization
};
