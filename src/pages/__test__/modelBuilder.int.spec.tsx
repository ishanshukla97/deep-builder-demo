import React from "react";
import { render, cleanup, fireEvent, createEvent, act } from "@testing-library/react";

import ModelBuilder from "../ModelBuilder";

beforeEach(() => cleanup());

test('renders without crashing', () => {
    render(<ModelBuilder />);
});