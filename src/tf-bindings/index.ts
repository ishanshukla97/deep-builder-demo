import { mappings as actMap } from "./activation";
import { mappings as basicMap } from "./basic";
import { mappings as convMap } from "./convolutional";
import { mappings as mergeMap } from "./merge";
import { mappings as poolingMap } from "./pooling";

export const mappings = {
    ...actMap,
    ...basicMap,
    ...convMap,
    ...mergeMap,
    ...poolingMap
};
