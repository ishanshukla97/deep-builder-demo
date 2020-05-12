import React from "react";
import { render, cleanup, fireEvent, createEvent, act } from "@testing-library/react";

import { OpsWidget } from "../OpsWidget";
import { OperationTypeToColorMapping } from "../../utils/constants"

beforeEach(() => cleanup());

const fakeOpItems = [
    {
        "func_name": "leakyRelu",
        "category": "Activation",
        "args": [
            { "name": "alpha", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    }
];

test('renders list of tensorflow operation items', () => {
    const {
        getByText,
        getByTestId
    } = render(<OpsWidget availableOps={fakeOpItems} />);
    const draggableOpNode = getByTestId('ops-bucket-item');

    const opNode = getByText('leakyRelu');

    expect(opNode.textContent).toMatch(fakeOpItems[0].func_name);
    expect(draggableOpNode.getAttribute('draggable')).toBeTruthy();
});

test('on drag start sets dataTransfer property correctly', () => {
    const setData = jest.fn()
    const ev = {
        dataTransfer: {
            setData
        }
    }
    const mockDataStr = JSON.stringify({
        model: "custom",
        name: fakeOpItems[0].func_name,
        args: fakeOpItems[0].args,
        color: OperationTypeToColorMapping[fakeOpItems[0].category]
    })
    const {
        getByTestId
    } = render(<OpsWidget availableOps={fakeOpItems} />);

    const draggableOpNode = getByTestId('ops-bucket-item');
    const mockDropEvent = createEvent.dragStart(draggableOpNode);
    
    Object.assign(mockDropEvent, ev);
    fireEvent(draggableOpNode, mockDropEvent)

    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('ops-node', mockDataStr);
});