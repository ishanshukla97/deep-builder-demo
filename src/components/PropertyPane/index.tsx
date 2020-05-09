import React from "react";
import { Input, Checkbox, Dropdown } from "semantic-ui-react";

import { parseStringToArray, parseArrayToString } from "../../utils/validation";

import "./index.scss"

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
    const handleBooleanChange = (isChecked: any, label: string) => {
        props.onChange(label, !isChecked);
    }
    const handleMultiSelectChange = (value: any, label: string) => {
        props.onChange(label, value)        
    }
    
    const renderLayerProps = (lp: any) => {
        return lp.map((item: any,idx: any) => {
            const inputProps = { ...item, type: "text", key: idx, label: item.name }
            
            switch (item.type) {
                case "number":
                    if (item.sub_type) {
                        return <InputFactory
                            {...inputProps}
                            value={parseArrayToString(item.value)}
                            onChange={(e: any) => handleArrayInputChange(e, item.name)}
                        />
                    }
                    return <InputFactory
                        {...inputProps}
                        type="number"
                        onChange={(e: any) => handleNumberInputChange(e, item.name)}
                    />
                case "string":
                    return <InputFactory
                        {...inputProps}
                        onChange={handleTextInputChange}
                    />
                case "boolean":
                    if (item.value === "") {
                        return <ToggleFactory
                            {...inputProps}
                            value={true}
                            type="boolean"
                            onChange={() => handleBooleanChange(true, item.name)}
                        />
                    }
                    return <ToggleFactory
                        {...inputProps}
                        type="boolean"
                        onChange={() => handleBooleanChange(item.value, item.name)}
                    />
                case "multiSelect":
                    const optList =  item.options.split('|');
                    const options = optList.map((opt: string) => ({ key: opt, value: opt, text: opt }));
                    return <MultiSelectFactory
                        {...inputProps}
                        options={options}
                        onChange={(e: any, { value }: any) => handleMultiSelectChange(value, item.name)}
                    />
                default:
                    return;
            }
        });
    }

    return <div className="property-pane">
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
    return <Checkbox 
        className="node__input-field"
        type="checkbox"
        label={props.label} 
        onChange={props.onChange}
        checked={props.value}
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
