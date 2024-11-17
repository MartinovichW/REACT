import React from 'react';
import ReactDOM from 'react-dom/client';

//import AppQuickStart from './QuickStart/App';
//import AppThinkingInReact from './ThinkingInReact/App';
//import AppTicTacToe from './TicTacToe/App';
import AppCanvas from './Canvas/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppCanvas />
  </React.StrictMode>
);
