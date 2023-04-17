import React from 'react';
import { config } from './config';

function App() {
  return (
    <div className="App">
      config: {JSON.stringify(config)}
    </div>
  );
}

export default App;
