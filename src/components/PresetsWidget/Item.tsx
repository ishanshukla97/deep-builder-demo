import React from "react";

interface IItem {
    name: string;
    model: string;
    info: string;
}

export const Item: React.FC<IItem> = props => {
    const handleDragStart =  (event: any) => {
        event.dataTransfer.setData("model-node", JSON.stringify({ 
            model: props.model,
            name: props.name,
            data: props.model
        }))
        
    }
    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            className="ops-bucket__item"
            data-testid='preset-item'
        >
            { props.name }
        </div>
    )
}