import React from "react";
import { useLocation } from "react-router-dom";
import PlaygroundWidget from "./PlaygroundWidget";

export interface ModelBuilderProps {
    defaultProps?: any
    app: any
}

const ModelBuilder: React.FC<ModelBuilderProps> = ({ defaultProps, app }) => {
    const location = useLocation();
    const isCurrentPage = location.pathname === "/"

    if (isCurrentPage) 
        return <PlaygroundWidget app={app} />
    return <div />
}

export default ModelBuilder;