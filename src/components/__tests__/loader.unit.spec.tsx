import React from "react";
import { render } from "@testing-library/react";

import {CustomLoader as Loader} from "../Loader"

test('renders loader with correct label', () => {
    //Arrange
    const fakeProps = {label: 'my correct label', isActive: true, size: undefined};
    //Act 
    const {container, getByText} = render(<Loader {...fakeProps} />);
    const labelNode = getByText(fakeProps.label);
    //Assert
    expect(labelNode).toBeTruthy();
    expect(container).toMatchSnapshot();
})