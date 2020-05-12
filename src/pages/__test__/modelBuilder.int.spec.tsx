import React from "react";
import { render, cleanup, fireEvent, createEvent, act } from "@testing-library/react";

import ModelBuilder from "../ModelBuilder";

test('renders without crashing', () => {
    const {getByText} = render(<ModelBuilder />);
});