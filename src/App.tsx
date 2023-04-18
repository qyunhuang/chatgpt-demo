import React from 'react';
import { config } from './config';
import { ChatGPTAPI } from 'chatgpt';
import { HttpsProxyAgent } from "https-proxy-agent";

const App = () => {
  const [text, setText] = React.useState<undefined | string>("");

  React.useEffect(() => {
    const test = async () => {
      const options = {
        apiKey: config.api,
        debug: true,
      };
      const api = new ChatGPTAPI({
        ...options, // Spread operator to include any additional options provided to ChatGPTAPI constructor
        fetch: (url, options = {}) => {
          const defaultOptions = {
            agent: new HttpsProxyAgent({host: '127.0.0.1', port: 7890}), // Update to pass proxy server information correctly
          }
          const mergedOptions = {
            ...defaultOptions,
            ...options, // Spread operator to override defaultOptions with any options provided to the fetch function
          }
          return fetch(url, mergedOptions) // Return fetch function with merged options
        },
      });

      const res = await api.sendMessage("tell me a joke");
      console.log(res.text, 1);
      setText(res.text);
    };

    test();
  }, []);

  return (
    <div className="App">
      {text}
    </div>
  );
}

export default App;
