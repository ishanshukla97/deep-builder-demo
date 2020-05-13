import React from "react";
import { render, cleanup, fireEvent, createEvent, act } from "@testing-library/react";

import { PresetWidget } from "../PresetsWidget";
import { setDataTransferProp } from "../../utils/test-utils";

beforeEach(() => cleanup());

const fakePresetItems = [
    {
        "name": "Resnet (identity)",
        "model": "stringified model",
        "info": "some info"
    }
];

test('renders list of model presets', () => {
    const {
        getByText,
        getByTestId
    } = render(<PresetWidget presets={fakePresetItems} />);
    const draggableOpNode = getByTestId('preset-item');

    const opNode = getByText(fakePresetItems[0].name);

    expect(opNode.textContent).toMatch(fakePresetItems[0].name);
    expect(draggableOpNode.getAttribute('draggable')).toBeTruthy();
});

test('on drag start sets dataTransfer property correctly', () => {
    const setData = jest.fn()
    
    const mockDataStr = JSON.stringify({
        model: fakePresetItems[0].model,
        name: fakePresetItems[0].name,
        data: fakePresetItems[0].model
    })
    const {
        getByTestId
    } = render(<PresetWidget presets={fakePresetItems} />);

    const draggableOpNode = getByTestId('preset-item');
    let mockDropEvent = createEvent.dragStart(draggableOpNode);
    mockDropEvent = setDataTransferProp({ setData }, mockDropEvent);
    fireEvent(draggableOpNode, mockDropEvent)

    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('model-node', mockDataStr);
});