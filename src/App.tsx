import React from 'react';
import { config } from './config';
import { ChatGPTAPI } from 'chatgpt';

const App = () => {
  const [text, setText] = React.useState<undefined | string>("");

  React.useEffect(() => {
    const test = async () => {
      const api = new ChatGPTAPI({
        apiKey: config.api,
      });

      const res = await api.sendMessage('write a joke!');
      setText(res.text);
      console.log(res.text)
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
