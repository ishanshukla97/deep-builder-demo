import React from "react";

import { Item } from "./Item"
interface IPreset {
    name: string;
    model: string;
    info: string;
}
interface IPresetWidgetProps {
    presets: IPreset[];
}

export const PresetWidget: React.FC<IPresetWidgetProps> = props => {
    return <div>
        {
            props.presets.map((item, idx) => {
                return <Item {...item} key={idx} />
            })
        }
    </div>
}