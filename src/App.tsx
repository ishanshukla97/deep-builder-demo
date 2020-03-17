import React from 'react';
import Application from "./components/Application";
import ModelBuilder from "./components/ModelBuilder";

import './App.css';

function App() {
  const app = new Application();
  return <ModelBuilder app={app} />
}

export default App;
