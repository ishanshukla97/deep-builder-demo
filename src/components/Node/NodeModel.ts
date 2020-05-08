import { NodeModel as BaseNodeModel, DefaultPortModel, DefaultNodeModel } from "@projectstorm/react-diagrams";
import { NodeModelGenerics as BaseNodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams-core"
import { BaseModelOptions } from "@projectstorm/react-canvas-core";
import _ from "lodash"

export interface NodeModelOptions extends BaseModelOptions {
    args?: any
    defaultArgs?: any;
    name?: string;
    color?: string;
}
export interface NodeModelGenerics extends BaseNodeModelGenerics {
    OPTIONS: NodeModelOptions;
}

export class NodeModel extends BaseNodeModel<NodeModelGenerics> {
    args: any;
    name!: string;
    color?: string
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];

    constructor (options: NodeModelOptions = {}, initializePorts: boolean = true) {
        super({
            ...options,
            type: options.type || "custom-node",
            name: options.name,
            color: options.color || "default-color"
        });
        this.name = options.name || "default-name"
        this.args = { ...options.defaultArgs }
        this.portsIn = [];
        this.portsOut = [];
        this.color = options.color || "default-color";
        
        if (initializePorts){
            this.addPort(
                new DefaultPortModel({
                    in: true,
                    name: "in",
                    alignment: PortModelAlignment.LEFT
                })
            );
            this.addPort(
                new DefaultPortModel({
                    in: false,
                    name: "out",
                    alignment: PortModelAlignment.RIGHT
                })
            );
        }
    }

    setArgs (args: any) {
        this.args = args;
    }

    addPort<T extends DefaultPortModel>(port: T): T {
		super.addPort(port);
		if (port.getOptions().in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
	}
    
    addInPort(label: string): DefaultPortModel {
        const p = new DefaultPortModel({
			in: true,
			name: label,
			label: label,
			alignment: PortModelAlignment.LEFT
        });
        
		return this.addPort(p);
    }

    addOutPort(label: string): DefaultPortModel {
		const p = new DefaultPortModel({
			in: false,
			name: label,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		return this.addPort(p);
    }

    getInPorts(): DefaultPortModel[] {
        return this.portsIn
    }
    getOutPorts(): DefaultPortModel[] {
        return this.portsOut;
    }

    serialize() {
        return _.merge(super.serialize(), { args: this.args, 
            name: this.name, 
            options: this.options 
        })
    }
    
    deserialize(event: any): void {
        super.deserialize(event);
        this.args = event.data.args
        this.name = event.data.name;
    }
}