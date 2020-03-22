import React from "react";

import "./index.scss";

export interface PlaygroundWidgetProps {
    renderAvailableOps: () => any;
    renderCanvasWidget: (className?: string) => any;
    handleAddNode: (name: string, args: any, event: any) => any;
    handleAddPresetModel: (data: any) => any;
}
export interface PlaygroundWidgetState {
    isParsing: boolean;
    isAdding: boolean;
    modelName: string;
}

export default class PlaygroundWidget extends React.Component<PlaygroundWidgetProps, PlaygroundWidgetState> {
    constructor (props: PlaygroundWidgetProps) {
        super(props);
        this.state = { 
            isParsing: false, 
            isAdding: false,
            modelName: ""
        }
        this.handleDrop = this.handleDrop.bind(this);
    }

    handleDrop (event: any) {
        if (event.dataTransfer.getData('ops-node')) {
            const data = JSON.parse(event.dataTransfer.getData('ops-node'));
            this.props.handleAddNode(data.name, data.args, event);
            return;
        }
        let data = JSON.parse(event.dataTransfer.getData('model-node'));
        if (data.data)  data = JSON.parse(data.data)
        
        this.props.handleAddPresetModel(data);
    }

    render () {
        return (
            <div className="playground-widget">
                <div className="playground-widget__header">Playground widget Header</div>
                <div className="playground-widget__container">
                    { this.props.renderAvailableOps() }
                    <div
                        onDrop={this.handleDrop}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                        className="playground-widget__content"
                    >
                        {
                            this.props.renderCanvasWidget("playground-widget--canvas-wrapper")
                        }
                    </div>
                </div>
            </div>
        )
    }
}