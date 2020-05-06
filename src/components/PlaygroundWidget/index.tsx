import React from "react";

import "./index.scss";
import { Container, Button, Input, Icon } from "semantic-ui-react";

export interface PlaygroundWidgetProps {
    renderAvailableOps: () => any;
    renderAvailablePresets: () => any;
    renderPropertyPane: () => any;
    renderCanvasWidget: (className?: string) => any;
    handleAddNode: (name: string, args: any, color: string, event: any) => any;
    handleAddPresetModel: (data: any) => any;
    renderLoader: () => any;
    addPreset: (name: string) => any;
    onDownload: () => any;
}
export interface PlaygroundWidgetState {
    name: string;
}

export const PlaygroundWidget: React.FC<PlaygroundWidgetProps> = props => {
    const [state, setState] = React.useState<PlaygroundWidgetState>({ name: "" })
    const handleDrop = (event: any) => {
        if (event.dataTransfer.getData('ops-node')) {
            const data = JSON.parse(event.dataTransfer.getData('ops-node'));
            props.handleAddNode(data.name, data.args, data.color, event);
            return;
        }
        let data = JSON.parse(event.dataTransfer.getData('model-node'));
        if (data.data)  data = JSON.parse(data.data)
        
        props.handleAddPresetModel(data);
    }
    const handleName = (e:any) => {
        setState({ name: e.target.value });
    }

    return (
        <Container fluid className="playground-widget">
            <div className="playground-widget__container">
                <div className="playground-widget__left-pane">
                    <div className="playground-widget__ops-container">
                        { props.renderAvailablePresets() }
                        { props.renderAvailableOps() }
                    </div>
                    <div className="playground-widget__property-pane-container">
                        { props.renderPropertyPane() }
                    </div>
                </div>
                <div
                    onDrop={handleDrop}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                    className="playground-widget__content"
                >
                    { props.renderLoader() }
                    { props.renderCanvasWidget("playground-widget--canvas-wrapper") }
                </div>
                <button 
                    onClick={props.onDownload} 
                    className='playground-widget--btn-download'>
                    <Icon name='download'/></button>   
            </div> 
        </Container>
    )
}