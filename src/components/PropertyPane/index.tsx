import React from "react";
import { Input, Checkbox, Dropdown } from "semantic-ui-react";

import { parseStringToArray } from "../../utils/validation";

interface PropertyPaneProps {
    opName?: string
    layerProps?: {
        name: string;
        type: string;
        sub_type?: string;
        options?: string;
        value?: any;
    }[];
    onChange: (type: string, value: any) => any;
}
interface PropertyPaneState {

}

export const PropertyPane: React.FC<PropertyPaneProps> = (props) => {
    
    const handleArrayInputChange = (e: any, label: string) => {
        const value = e.target.value;
        props.onChange(label, parseStringToArray(value));
    }
    const handleNumberInputChange = (e: any, label: string) => {
        const value = e.target.value;
        props.onChange(label, parseInt(value));
    }
    const handleTextInputChange = (e: any, label: string) => {
        const value = e.target.value;
        props.onChange(label, value)
    }
    const handleBooleanChange = (e: any) => {

    }
    const handleMultiSelectChange = (e: any) => {

    }
    
    const renderLayerProps = (lp: any) => {
        return lp.map((item: any,idx: any) => {
            const inputProps = { ...item, type: "text", key: idx, label: item.name }
            
            switch (item.type) {
                case "number":
                    if (item.sub_type) {
                        return <InputFactory
                            {...inputProps}
                            onChange={(e: any) => handleArrayInputChange(e, item.name)}
                        />
                    }
                    return <InputFactory
                        {...inputProps}
                        onChange={(e: any) => handleNumberInputChange(e, item.name)}
                    />
                case "string":
                    return <InputFactory
                        {...inputProps}
                        onChange={handleTextInputChange}
                    />
                case "boolean":
                    return <ToggleFactory
                        {...inputProps}
                        onChange={handleBooleanChange}
                    />
                // case "multiSelect":
                //     return <MultiSelectFactory
                //         {...inputProps}
                //         onChange={handleMultiSelectChange}
                //     />
                // default:
                //     return;
            }
        });
    }

    return <div className="property-pane">
        <div className="property-pane__header">Layer Property</div>
        {
            props.layerProps && (
                <div className="property-pane__layer-properties">
                    <span className="property-pane--layer-title">{props.opName}</span>
                    <div className="property-pane__property-list">
                        {
                            renderLayerProps(props.layerProps)
                        }
                    </div>
                </div>)
        }
    </div>
}

export interface BaseFactoryProps {
    label: string;
    onChange?: any;
    type?: string;
    sub_type: string;
    value?: any;
    key: number;
}

export const InputFactory: React.FC<BaseFactoryProps> = props => {
    return <Input 
        className="node__input-field"
        fluid
        type={props.type} 
        onChange={props.onChange} 
        label={props.label} 
        size="mini"
        value={props.value}
        key={props.key}
    />
}

export interface ToggleFactoryProps extends BaseFactoryProps {
    type: string
}
export const ToggleFactory: React.FC<ToggleFactoryProps> = props => {
    if (props.value === undefined) {
        return <Checkbox 
            className="node__input-field"
            type="checkbox"
            label={props.label} 
            onChange={props.onChange}
            defaultChecked
            color="white" 
        />
    }
    
    return <Checkbox 
        className="node__input-field"
        type="checkbox"
        label={props.label} 
        onChange={props.onChange}
        defaultChecked={props.value}
        color="white" 
    />
}


export interface MultiSelectFactoryProps extends BaseFactoryProps {
    options: [{
        key: string;
        text: string;
        value: string;
    }];
}
export const MultiSelectFactory: React.FC<MultiSelectFactoryProps> = props => {
    return <div>{ props.label }<Dropdown 
        className="node__input-field"
        inline 
        fluid
        size="mini"
        options={props.options}
        defaultValue={props.value || props.options[0].value}
        scrolling
        onChange={props.onChange}
    />
    </div>
}
