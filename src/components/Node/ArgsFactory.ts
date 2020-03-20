import { InputFactory, ToggleFactory, MultiSelectFactory } from "./argFactories/index.react";

let registeredComponentFactories: any = {};

registeredComponentFactories["input"] = InputFactory;
registeredComponentFactories["toggle"] = ToggleFactory;
registeredComponentFactories["multiSelect"] = MultiSelectFactory;

class NodeArgsFactory {
    constructor (type: string, props: any) {
        return registeredComponentFactories[type](props);
    }
}

export default NodeArgsFactory;