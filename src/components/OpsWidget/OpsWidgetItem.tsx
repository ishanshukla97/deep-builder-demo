import React from "react";

export interface OpsWidgetItemProps {
    model: any;
    color?: string;
    name: string;
    args?: any;
    data?: any;
}

export default class OpsWidgetItem extends React.Component<OpsWidgetItemProps> {
    constructor (props: OpsWidgetItemProps) {
        super(props);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    handleDragStart (event: any) {
        if (this.props.model.type === "_Model") {
            event.dataTransfer.setData("model-node", JSON.stringify({ 
                model: this.props.model,
                name: this.props.name,
                data: this.props.data
            }))
            return;
        }
        event.dataTransfer.setData("ops-node", JSON.stringify({ 
            model: this.props.model,
            name: this.props.name,
            args: this.props.args
        }));
        return;
    }

    render () {
        return (
            <div
                color={this.props.color}
                draggable={true}
                onDragStart={this.handleDragStart}
                className="ops-bucket__item"
            >
                { this.props.name }
            </div>
        )
    }
}