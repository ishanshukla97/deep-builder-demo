import React from "react";

import { OpsWidgetItem } from "./Item";
import { OperationTypeToColorMapping } from "../../utils/constants"
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
    return <div>
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
