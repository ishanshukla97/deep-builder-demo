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
    onClickFaq: () => any;
}
export interface PlaygroundWidgetState {
    name: string;
}

export const PlaygroundWidget: React.FC<PlaygroundWidgetProps> = props => {
    const [state, setState] = React.useState<PlaygroundWidgetState>({ name: "" })
    const handleDrop = (event: any) => {
        const opsNodeData = event.dataTransfer.getData('ops-node')
        if (opsNodeData) {
            const data = JSON.parse(opsNodeData);
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
                    <span className="playground-widget--ops-title">COMPONENTS</span>
                    <div className="playground-widget__ops-container">
                        { props.renderAvailablePresets() }
                        { props.renderAvailableOps() }
                    </div>
                    <span className="playground-widget--property-pane-title">LAYER PROPERTY</span>
                    <div className="playground-widget__property-pane-container">
                        { props.renderPropertyPane() }
                    </div>
                </div>
                <div
                    onDrop={handleDrop}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                    data-testid='playground-widget-main'
                    className="playground-widget__content"
                >
                    { props.renderLoader() }
                    { props.renderCanvasWidget("playground-widget--canvas-wrapper") }
                </div>
                <div className='playground-widget__sidebar'>
                    <button
                        data-testid='btn-download'
                        onClick={props.onDownload} 
                        className='playground-widget--btn-download'>
                        <Icon name='download'/>
                    </button>
                    <button 
                        className='playground-widget--btn-faq'
                        onClick={() => props.onClickFaq()}>
                        FAQ
                    </button>
                </div>
            </div> 
        </Container>
    )
}