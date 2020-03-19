import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import Application from "./components/Application";
import ModelBuilder from "./components/ModelBuilder";

import './App.css';

function App() {
  const app = new Application();
  return (<Router>
    <ModelBuilder app={app} />
  </Router>);
}

export default App;
