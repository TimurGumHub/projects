import React from 'react';
import logo from './logo.svg';
import './App.css';
import Contacts from './Contacts';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Мои контакты</h1>
        <Contacts />
        
      </header>
    </div>
  );
}

export default App;
