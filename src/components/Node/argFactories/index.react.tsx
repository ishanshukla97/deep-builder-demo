import React from "react";
import { Input, Checkbox, Dropdown } from "semantic-ui-react";

export interface BaseFactoryProps {
    label?: string;
    onChange?: any;
    type?: string;
    sub_type?: string;
    value?: any;
    key: number;
}
export const InputFactory: React.FC<BaseFactoryProps> = props => {
    const onChange = (e: any) => {
        const value: string = e.target.value;

        if (props.sub_type) {
            const arrStr = value.split(",");
            const arrNum: number[] = [];
            let numNan = 0
            
            arrStr.forEach((item, idx) => {
                const int = parseInt(item.trim());
                if (isNaN(int) && idx === 0) {
                    return;
                }
                if (isNaN(int) && numNan < 1) {
                    arrNum.push(int);
                    numNan += 1;
                }
                if (!isNaN(int)) {
                    arrNum.push(int)
                }
            });

            props.onChange(props.label, arrNum)
            return;
        }

        if (props.type === "number") {
            const num = parseInt(value);
            props.onChange(props.label, num);
            return;
        }

        props.onChange(props.label, value);
        return;
    }

    return <Input 
        className="node__input-field"
        fluid
        type={props.type} 
        onChange={onChange} 
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
    const onChange = (e: any, { checked }: any) => {
        const value = checked;
        props.onChange(props.label, value);
    }
    
    if (props.value === undefined) {
        return <Checkbox 
            className="node__input-field"
            type="checkbox"
            label={props.label} 
            onChange={onChange}
            defaultChecked
            color="white" 
        />
    }
    
    return <Checkbox 
        className="node__input-field"
        type="checkbox"
        label={props.label} 
        onChange={onChange}
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
    const onChange = (e: any, { value }: any) => {
        props.onChange(props.label, value)
    }
    
    return <div>{ props.label }<Dropdown 
        className="node__input-field"
        inline 
        fluid
        size="mini"
        options={props.options}
        defaultValue={props.value || props.options[0].value}
        scrolling
        onChange={onChange}
    />
    </div>
}