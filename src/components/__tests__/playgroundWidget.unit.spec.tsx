import React from "react";
import { render, cleanup, fireEvent, createEvent } from "@testing-library/react";

import { PlaygroundWidget } from '../PlaygroundWidget';
import { setDataTransferProp } from '../../utils/test-utils';

beforeEach(() => cleanup());

test('renders component and property pane correctly', () => {
    const renderAvailableOps = jest.fn();
    const renderAvailablePresets = jest.fn();
    const renderPropertyPane = jest.fn();
    const renderCanvasWidget = jest.fn();
    const handleAddNode = jest.fn();
    const handleAddPresetModel = jest.fn();
    const renderLoader = jest.fn();
    const addPreset = jest.fn();
    const onDownload = jest.fn();
    const { getByText } = render(<PlaygroundWidget 
        renderAvailableOps={renderAvailableOps}
        renderAvailablePresets={renderAvailablePresets}
        renderCanvasWidget={renderCanvasWidget}
        renderPropertyPane={renderPropertyPane}
        handleAddNode={handleAddNode}
        handleAddPresetModel={handleAddPresetModel}
        renderLoader={renderLoader}
        addPreset={addPreset}
        onDownload={onDownload}
    />);

    const componentTextNode = getByText('COMPONENTS');
    const propertyTextNode = getByText('LAYER PROPERTY');
    
    expect(componentTextNode.textContent).toBe('COMPONENTS');
    expect(propertyTextNode.textContent).toBe('LAYER PROPERTY');
    expect(renderAvailableOps).toHaveBeenCalledTimes(1);
    expect(renderAvailablePresets).toHaveBeenCalledTimes(1);
    expect(renderPropertyPane).toHaveBeenCalledTimes(1);
});

test('renders playground area where tensorflow op nodes can be dropped', () => {
    const renderAvailableOps = jest.fn();
    const renderAvailablePresets = jest.fn();
    const renderPropertyPane = jest.fn();
    const renderCanvasWidget = jest.fn();
    const handleAddNode = jest.fn();
    const handleAddPresetModel = jest.fn();
    const renderLoader = jest.fn();
    const addPreset = jest.fn();
    const onDownload = jest.fn();
    const { getByText, getByTestId } = render(<PlaygroundWidget 
        renderAvailableOps={renderAvailableOps}
        renderAvailablePresets={renderAvailablePresets}
        renderCanvasWidget={renderCanvasWidget}
        renderPropertyPane={renderPropertyPane}
        handleAddNode={handleAddNode}
        handleAddPresetModel={handleAddPresetModel}
        renderLoader={renderLoader}
        addPreset={addPreset}
        onDownload={onDownload}
    />);
    const mockDropData = {name: "xyz name", args: "any args", color: "redblueyellow"}
    const mockGetDataFn = jest.fn();
    mockGetDataFn.mockReturnValueOnce(JSON.stringify(mockDropData));

    const droppableNode = getByTestId('playground-widget-main');
    const dropEvent = createEvent.drop(droppableNode);
    Object.assign(dropEvent, { dataTransfer: {getData: mockGetDataFn} });
    
    fireEvent(droppableNode, dropEvent);
    expect(mockGetDataFn).toHaveBeenCalledWith('ops-node');
    expect(handleAddPresetModel).not.toHaveBeenCalled();
    expect(handleAddNode).toHaveBeenCalledTimes(1);
});


test('renders playground area where presets can be dropped', () => {
    const renderAvailableOps = jest.fn();
    const renderAvailablePresets = jest.fn();
    const renderPropertyPane = jest.fn();
    const renderCanvasWidget = jest.fn();
    const handleAddNode = jest.fn();
    const handleAddPresetModel = jest.fn();
    const renderLoader = jest.fn();
    const addPreset = jest.fn();
    const onDownload = jest.fn();
    const { getByText, getByTestId } = render(<PlaygroundWidget 
        renderAvailableOps={renderAvailableOps}
        renderAvailablePresets={renderAvailablePresets}
        renderCanvasWidget={renderCanvasWidget}
        renderPropertyPane={renderPropertyPane}
        handleAddNode={handleAddNode}
        handleAddPresetModel={handleAddPresetModel}
        renderLoader={renderLoader}
        addPreset={addPreset}
        onDownload={onDownload}
    />);
    const mockDropData = {data: JSON.stringify({ data: 'model' })}
    const getData = jest.fn();
    getData
    .mockReturnValueOnce(undefined)
    .mockReturnValueOnce(JSON.stringify(mockDropData));

    const droppableNode = getByTestId('playground-widget-main');
    let dropEvent = createEvent.drop(droppableNode);
    dropEvent = setDataTransferProp({ getData }, dropEvent)
    
    fireEvent(droppableNode, dropEvent);
    expect(getData).toHaveBeenCalledWith('model-node');
    expect(handleAddPresetModel).toHaveBeenCalledTimes(1);
    expect(handleAddNode).not.toHaveBeenCalled();
});

test('triggers download when clicked on download button', () => {
    const renderAvailableOps = jest.fn();
    const renderAvailablePresets = jest.fn();
    const renderPropertyPane = jest.fn();
    const renderCanvasWidget = jest.fn();
    const handleAddNode = jest.fn();
    const handleAddPresetModel = jest.fn();
    const renderLoader = jest.fn();
    const addPreset = jest.fn();
    const onDownload = jest.fn();
    const { getByText, getByTestId } = render(<PlaygroundWidget 
        renderAvailableOps={renderAvailableOps}
        renderAvailablePresets={renderAvailablePresets}
        renderCanvasWidget={renderCanvasWidget}
        renderPropertyPane={renderPropertyPane}
        handleAddNode={handleAddNode}
        handleAddPresetModel={handleAddPresetModel}
        renderLoader={renderLoader}
        addPreset={addPreset}
        onDownload={onDownload}
    />);
    const downloadBtnNode = getByTestId('btn-download');

    fireEvent.click(downloadBtnNode);

    expect(onDownload).toHaveBeenCalled();
})