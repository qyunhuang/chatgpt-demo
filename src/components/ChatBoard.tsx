import * as React from 'react';
import { config } from "../config/config";
import { ChatGPTAPI } from "chatgpt";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Stack, Typography, Box } from "@mui/material";
import { selectSendMsg, selectHistory } from "../store/uiSlice";
import { useSelector, useDispatch } from 'react-redux';
import { uiSlice } from "../store/uiSlice";
import CodeBlock from "./CodeBlock";

const ChatBoard = () => {
  const [ans, setAns] = React.useState<string>("");
  const [onProgress, setOnProgress] = React.useState<boolean>(false);
  const sendMsg = useSelector(selectSendMsg);
  const chatHistory = useSelector(selectHistory);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getAns = async () => {
      if (chatHistory.length % 2 === 0) {
        return;
      }

      const options = {
        apiKey: config.api,
        debug: true,
      };

      const api = new ChatGPTAPI({
        ...options, // Spread operator to include any additional options provided to ChatGPTAPI constructor
        fetch: (url, options = {}) => {
          const defaultOptions = {
            agent: new HttpsProxyAgent({host: config.proxyHost, port: config.proxyPort}), // Update to pass proxy server information correctly
          }
          const mergedOptions = {
            ...defaultOptions,
            ...options, // Spread operator to override defaultOptions with any options provided to the fetch function
          }
          return fetch(url, mergedOptions) // Return fetch function with merged options
        },
      });

      const res = await api.sendMessage(sendMsg, {
        onProgress: r => {
          setOnProgress(true);
          setAns(r.text);
        },
      });

      console.log(res.text);

      setOnProgress(false);
      dispatch(uiSlice.actions.pushAnswer(res.text));
    };

    if (sendMsg) {
      getAns().then(() => {});

      window.scrollTo({
        top: document.body.scrollHeight,
      });
    }
  }, [sendMsg, dispatch, chatHistory.length]);

  React.useEffect(() => {
    if (onProgress) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [ans, onProgress]);

  const codeBlocks = (text: string) => text.split('```').map((item, index) => {
    if (index % 2 === 0) {
      return (
        <Typography key={index}>
          {item}
        </Typography>
      );
    }

    const lang = item.split('\n')[0] || 'jsx';
    const code = item.slice(item.indexOf('\n') + 1);

    return <CodeBlock key={index} code={code} language={lang} />;
  });

  const chatHistoryList = chatHistory.map((item, index) => {
    return (
      <Box key={index} className={item.msgType === 'question' ? 'question' : 'answer'}>
        {codeBlocks(item.msg)}
      </Box>
    );
  });

  return (
    <Stack>
      {chatHistoryList}
      {onProgress && <Box className={'answer'}>
        {codeBlocks(ans)}
      </Box>}
    </Stack>
  );
}

export default ChatBoard;
