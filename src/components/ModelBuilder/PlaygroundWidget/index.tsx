import React from "react";
import { ApolloConsumer } from "@apollo/react-hooks"
import { Query } from "react-apollo";
import gql from "graphql-tag";
import OpsWidget from "../OpsWidget";
import OpsWidgetItem from "../OpsWidget/OpsWidgetItem";
import Application from "../../Application";
import { NodeModel } from "../Node/NodeModel";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import ops from "../OpsBucket/ops";
import "./index.scss";
import { Button, Input, Loader } from "semantic-ui-react";
import ApolloClient from "apollo-client";

export interface PlaygroundWidgetProps {
    app: Application;
    client: ApolloClient<object>
}
export interface PlaygroundWidgetState {
    isParsing: boolean;
    isAdding: boolean;
    modelName: string;
}

const ADD_MODEL = gql`
    mutation addModel($modelInput: ModelInput) {
        addModel(modelInput: $modelInput)
    }
`
const LIST_MODELS = gql`
    query listModels {
        listModels {
            model,
            name,
            id
        }
    }
`
const GET_CURRENT_MODEL = gql`
    {
        frontModel @client
    }
`

export default class PlaygroundWidget extends React.Component<PlaygroundWidgetProps, PlaygroundWidgetState> {
    constructor (props: PlaygroundWidgetProps) {
        super(props);
        this.state = { 
            isParsing: false, 
            isAdding: false,
            modelName: ""
        }
        this.handleParseGraph = this.handleParseGraph.bind(this);
        this.handleAddGraph = this.handleAddGraph.bind(this);
        this.handleModelNameChange = this.handleModelNameChange.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    // componentDidMount () {
    //     const cache = this.props.client.readQuery({ query: GET_CURRENT_MODEL })
    //     const { frontModel } = cache
    //     if (frontModel && frontModel.length) {
    //         this.props.app.newModel()
    //         const e = {
    //             dataTransfer: {
    //                 getData: (key: string) => {
    //                     if (key === "model-node") {
    //                         return frontModel
    //                     }
    //                 }
    //             }
    //         }
            
    //         this.handleDrop(e)
    //     }
    // }

    async handleSetModel (client: any) {
        const strNodes = await this.parseGraph();
        const frontModel = JSON.stringify(this.props.app.getDiagramEngine().getModel().serialize());
        
        await client.writeData({ data: { currentModel: strNodes, frontModel } })
    }

    async handleAddGraph (client: any) {
        this.setState({ isAdding: true });

        const currentModel = this.props.app.getDiagramEngine().getModel().serialize();
        const stringifiedModel = await JSON.stringify(currentModel);
        const modelInput = { model: stringifiedModel, name: this.state.modelName }
        await client.mutate({ mutation: ADD_MODEL, variables: { modelInput } });

        this.setState({ isAdding: false });
    }

    async handleParseGraph (client: any) {
        this.setState({ isParsing: true });
        await this.parseGraph(client);
        this.setState({ isParsing: false })
    }

    handleModelNameChange (e: any, { value }: any) {
        this.setState({ modelName: value })        
    }

    handleDrop (event: any) {
        if (event.dataTransfer.getData('ops-node')) {
            const data = JSON.parse(event.dataTransfer.getData('ops-node'));
            
            let node: NodeModel;
            node = new NodeModel({name: data.name, args: data.args});
    
            let point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
            node.setPosition(point);
            this.props.app.getDiagramEngine().getModel().addNode(node);
            
            this.forceUpdate();
            return;
        }
        let data = JSON.parse(event.dataTransfer.getData('model-node'));
        if (data.data)  data = JSON.parse(data.data)
        
        /**
         * 1) Get links and nodes from preset model object
         * 2) Add all the nodes to graph using model.addNode()
         * 3) For every node check if it has links, get the corresponding
         *      in and out ports of source and target respectively
         * 4) Add link between source and target port using srcPort.add(trgPort)
         */
        const nodes: any = [];
        const links: any = [];
        let presetToCurrentId: any = {};

        Object.keys(data.layers[1].models).forEach(nodeId => {
            nodes.push(data.layers[1].models[nodeId])
        });
        Object.keys(data.layers[0].models).forEach(linkId => {
            const link = data.layers[0].models[linkId];

            const linkTuple = [link.source, link.target];
            links.push(linkTuple)
        });

        nodes.forEach((nodePreset: any) => {
            const { name, args, options, x, y, id } = nodePreset
            const node = new NodeModel({ name, args: options.args, defaultArgs: args });
            node.setPosition(x, y);
            node.setSelected(true);
            this.props.app.getDiagramEngine().getModel().addNode(node);

            presetToCurrentId[id] = node;
        });

        links.forEach((linkTuple: any) => {
            const [srcId, trgId] = linkTuple;
            /**
             * Get src, trg node of current graph using presetToCurrent map
             */
            const srcNode = presetToCurrentId[srcId]
            const trgNode = presetToCurrentId[trgId]
            const srcPort = srcNode.getOutPorts()[0];
            const trgPort = trgNode.getInPorts()[0];

            if (srcPort && trgPort){
                const link = srcPort.link(trgPort)
                this.props.app.getDiagramEngine().getModel().addAll(link);
                this.forceUpdate()
            }
        })
        
        return;
    }

    async parseGraph (client?: any) {
        /**
         * This function parses Diagram Nodes to a format that
         * is accepted by gql server
         */
        const links = this.props.app.getActiveDiagram().getLinks();
        
        const edges: any = [];

        links.forEach(link => {
            const node1 = {
                id: link.getSourcePort().getParent().getOptions().id,
                //@ts-ignore
                ops: link.getSourcePort().getParent().getOptions().name,
                //@ts-ignore
                args: link.getSourcePort().getParent().args
            }
            const node2 = {
                id: link.getTargetPort().getParent().getOptions().id,
                //@ts-ignore
                ops: link.getTargetPort().getParent().getOptions().name,
                //@ts-ignore
                args: link.getTargetPort().getParent().args
            }
            edges.push([node1, node2]);
        });

        /*
         * 1) Get all nodes.
         * 2) For all edges add node ids to input and output
         *      example: edge -> [node["1"], node["2"]], 
         *               add node["1"].edges = node["2"],
         *               add node["2"].inputs = [node["1"]]
         */
        let nodes: any = {};

        edges.forEach((edge: any) => {
            const [srcNode, trgNode] = edge;

            if (!nodes[srcNode.id]) {
                nodes[srcNode.id] = { ...srcNode };
            }
            if (nodes[srcNode.id].edges) {
                nodes[srcNode.id].edges.push(trgNode.id);
            } else {
                nodes[srcNode.id].edges = [trgNode.id];
            }
            if (!nodes[srcNode.id].inputs)   nodes[srcNode.id].inputs = []

            if (!nodes[trgNode.id]) {
                nodes[trgNode.id] = { ...trgNode };
            }
            if (nodes[trgNode.id].inputs) {
                nodes[trgNode.id].inputs.push(srcNode.id);
            } else {
                nodes[trgNode.id].inputs = [srcNode.id];
            }
            if (!nodes[trgNode.id].edges)   nodes[trgNode.id].edges = []
        });
        
        /* Convert object to array and stringify */
        const nodeVals = Object.values(nodes);
        const stringfiedNodes = JSON.stringify(nodeVals);

        return stringfiedNodes;
    }

    render () {
        return (
            <div className="playground-widget">
                <div className="playground-widget__header">Playground widget Header</div>
                <div className="playground-widget__container">
                    <OpsWidget>
                        <Query query={LIST_MODELS}>
                            {
                                ({ loading, error, data }: any) => {
                                    if (loading)    return <Loader />
                                    if (error)      return <span>Oops! An error occured.</span>
                                    
                                    return data.listModels.map((dataItem: any) => <OpsWidgetItem
                                        model={{type: "_Model"}}
                                        name={dataItem.name}
                                        data={dataItem.model}
                                        key={dataItem.id}
                                    />)
                                }
                            }
                        </Query>
                        {
                            ops.map(op => 
                                <OpsWidgetItem 
                                    model={{type: "custom"}} 
                                    name={op.func_name} 
                                    key={op.func_name} 
                                    args={op.args} 
                                />
                            )
                        }
                    </OpsWidget>
                    <div
                        onDrop={this.handleDrop}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                        className="playground-widget__content"
                    >
                        <CanvasWidget 
                            engine={this.props.app.getDiagramEngine()}
                            className="playground-widget--canvas-wrapper" 
                        />
                    </div>
                    <div className="playground-widget__action-bar">
                        <ApolloConsumer>
                            {
                                (client) => {
                                    return <>
                                        <Button 
                                            className="playground-widget--btn"
                                            onClick={() => this.handleParseGraph(client)} 
                                            loading={this.state.isParsing}
                                        >Parse</Button>
                                        <Input
                                            className="playground-widget--input"
                                            onChange={this.handleModelNameChange}
                                            placeholder="preset name"
                                        />
                                        <Button
                                            className="playground-widget--btn"
                                            onClick={() => this.handleAddGraph(client)}
                                            loading={this.state.isAdding}
                                        >Add Preset</Button>
                                        <Button
                                            className="playground-widget--btn"
                                            onClick={() => this.handleSetModel(client)}
                                        >
                                        Set Model</Button>
                                    </>
                                }
                            }
                        </ApolloConsumer>
                    </div>
                </div>
            </div>
        )
    }
}