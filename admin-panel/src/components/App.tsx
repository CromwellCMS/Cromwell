import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { Sidebar } from './sidebar/Sidebar';

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <Sidebar />
    </div>
  );
}

export default App;
