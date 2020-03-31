import React from "react";

import { OpsWidgetItem } from "./OpsWidgetItem";
import "./index.scss";

interface IArgs {
    name: string;
    type: string;
    options?: string;
    sub_type?: string;
}
interface IOperation {
    func_name: string;
    category: string;
    args: IArgs[]
}
interface IOpsWidgetProps {
    availableOps: IOperation[];
}

export const OpsWidget: React.FC<IOpsWidgetProps> = props => {
    return <div className="ops-bucket">
        {
            props.availableOps.map(op => (<OpsWidgetItem
                model="custom"
                name={op.func_name}
                key={op.func_name}
                args={op.args}
                color={OperationTypeToColorMapping[op.category]}
            />))
        }
    </div>
}

const OperationTypeToColorMapping: Record<string, string> = {
    "Basic": "dark-blue",
    "Activation": "red",
    "Convolution": "purple",
    "Merge": "yellow",
    "Pooling": "cyan",
    "Normalization": "green",
    "Input": "blue"
}