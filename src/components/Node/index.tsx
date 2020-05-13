import React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { Accordion, Icon } from "semantic-ui-react";

import { NodeModel } from "./NodeModel";
import NodeArgsFactory from "./ArgsFactory";
import "./index.scss"

export interface NodeWidgetProps {
    node: NodeModel;
    engine: DiagramEngine;
}
export interface NodeWidgetState {
    showArgs: boolean;
    args: any;
}

export class NodeWidget extends React.Component<NodeWidgetProps, NodeWidgetState> {
    constructor (props: NodeWidgetProps) {
        super(props);
        this.state = {
            showArgs: false,
            args: { ...this.props.node.args }
        };
        this.toggleArgs = this.toggleArgs.bind(this);
        this.handleArgChange = this.handleArgChange.bind(this);
    }

    toggleArgs () {
        this.setState({ ...this.state, showArgs: !this.state.showArgs });
    }

    handleArgChange (type: string, value: any) {
        this.setState({ 
            args: { ...this.state.args, [type]: value }},
            () => this.updateNodeArgs()
        );
    }

    updateNodeArgs () {
        this.props.node.args = this.state.args;
    }

    renderArgs (args: any) {
        if (args.length) {
            return args.map((arg: any, idx: number) => {
                const argProps = { 
                    label: arg.name, 
                    onChange: this.handleArgChange, 
                    value: this.state.args[arg.name],
                    key: idx
                }

                if (arg.type === "number") {
                    if (arg.sub_type) {
                        let strValue = ""
                        const arr = this.state.args[arg.name];
                        
                        if (arr) {
                            if (isNaN(arr[arr.length - 1]) && arr.length !== 0) {
                                arr.pop();
                                strValue = arr.toString() + ",";
                                
                            } else {
                                strValue = arr.toString();
                            }
                        }
                        
                        return new NodeArgsFactory("input", { 
                            ...argProps,
                            type: "text", 
                            sub_type: arg.sub_type, 
                            value: strValue,
                        })
                    }
                    return new NodeArgsFactory("input", { type: "number", ...argProps })
                } else if (arg.type === "string") {
                    return new NodeArgsFactory("input", { type: "text", ...argProps })
                } else if (arg.type === "boolean") {
                    return new NodeArgsFactory("toggle", { type: "boolean", ...argProps })
                } else if (arg.type === "multiSelect") {
                    let options = arg.options.split("|");
                    options = options.map((option: string) => {
                        return { key: option, text: option, value: option }
                    })
                    return new NodeArgsFactory("multiSelect", { options, ...argProps })
                }
            })
        }
        return <div />
    }

    render() {
        return (
            <div className={this.props.node.isSelected()? "node--selected": ""} data-testid='op-node'>
                <div className={"node__title " + "node__title--" + this.props.node.color}>
                    <p>{ this.props.node.getOptions().name }</p>
                </div>
                <Accordion>
                    <Accordion.Title>
                        <Icon name='add' className="node--white-imp" />
                        <p className="m-0 node--white-imp">Args</p>
                    </Accordion.Title>
                    {/* <Accordion.Content active={this.state.showArgs} className="node__content node--white-imp">
                        {
                            this.renderArgs(this.props.node.getOptions().args)
                        }
                    </Accordion.Content> */}
                </Accordion>
                <div className="node__port--container">
                    
                    <PortWidget engine={this.props.engine} 
                    port={this.props.node.getInPorts()[0]}>
                        <div className="node__port node__port--in" />
                    </PortWidget>
                    <PortWidget engine={this.props.engine}
                    port={this.props.node.getOutPorts()[0]}>
                        <div className="node__port node__port--out" />
                    </PortWidget>
                </div>
            </div>
        )
    }
}