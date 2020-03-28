import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pages from "./pages";

import './App.css';

function App() {
  return (<Router>
    <ToastContainer />
    <Pages />
  </Router>);
}

export default App;
