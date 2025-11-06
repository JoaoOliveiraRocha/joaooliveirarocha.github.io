import React, { useState, useCallback } from 'react';
import { TopperWebSdk, TOPPER_EVENTS } from '@uphold/topper-web-sdk';

function App() {
  const [token, setToken] = useState('');
  const [topperInstance, setTopperInstance] = useState(null);

  const startTopper = useCallback(() => {
    if (!token) {
      alert('Please provide a bootstrap token.');
      return;
    }

    console.log('Creating a new Topper SDK instance...');
    
    // 1. Create an instance of the TopperWebSdk.
    // This will open in a new tab by default.
    const topper = new TopperWebSdk({
      environment: "sandbox",
    });


    // 3. Initialize Topper with the token from the input field.
    console.log('Initializing Topper...');
    topper.initialize({
      bootstrapToken: token,
    });

    // Save the instance if you need to interact with it later
    setTopperInstance(topper);

        // 2. Add an event listener to log all postMessages.
    topper.on(TOPPER_EVENTS.ALL, ({ data, name }) => {
      console.log('Received postMessage:', { eventName: name, payload: data });
    });


  }, [token]); // Re-create the function if the token changes

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <header className="App-header">
        <h1>Topper Web SDK React Example</h1>
        <p>
          Enter your bootstrap token below and click the button to start the Topper experience.
        </p>
        <div style={{ margin: '1rem 0' }}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your bootstrap token"
            style={{ width: '350px', padding: '10px', marginRight: '10px' }}
          />

          <button onClick={startTopper} style={{ padding: '10px 15px' }}>
            Start Topper
          </button>
        </div>


        <p>After starting, check the browser's developer console to see the postMessage logs.</p>
      </header>
    </div>
  );
}

export default App;
