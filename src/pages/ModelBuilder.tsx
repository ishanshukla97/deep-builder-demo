import React from "react";
import { Container } from "semantic-ui-react";

import Playground from "../components/PlaygroundWidget"
import { DiagramApplication } from "../DiagramApplication"
import { OpsWidget } from "../components/OpsWidget";
import ops from "../tf-bindings/ops";

interface IModelBuilderProps {
    
}

const ModelBuilder: React.FC<IModelBuilderProps> = (props) => {
    const diagramApp: DiagramApplication = new DiagramApplication();
    return <Container>
        <Playground 
            app={diagramApp} 
            renderAvailableOps={() => <OpsWidget availableOps={ops} />} 
        />
    </Container>
}

export default ModelBuilder;