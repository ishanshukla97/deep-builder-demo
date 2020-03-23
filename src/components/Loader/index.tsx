import React from "react";
import { Loader } from "semantic-ui-react";

import "./index.scss"

interface CustomLoaderProps {
    label: string;
    isActive: boolean;
    size: "big" | "small" | "mini" | "tiny" | "medium" | "large" | "huge" | "massive" | undefined;
}

export const CustomLoader: React.FC<CustomLoaderProps> = (props) => {
    if (props.isActive) {
        return <div className="custom-loader">
              
            <Loader content={ props.label }  size={props.size} inline active={props.isActive} />
        </div>
    }
    return <></>
}