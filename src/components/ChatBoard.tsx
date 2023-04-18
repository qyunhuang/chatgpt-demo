import * as React from 'react';
import { config } from "../config/config";
import { ChatGPTAPI } from "chatgpt";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Stack, Typography, Box } from "@mui/material";
import { selectSendMsg, selectHistory } from "../store/uiSlice";
import { useSelector, useDispatch } from 'react-redux';
import { uiSlice } from "../store/uiSlice";

const ChatBoard = () => {
  const [ans, setAns] = React.useState<undefined | string>("");
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

      console.log(res);

      setOnProgress(false);
      dispatch(uiSlice.actions.pushAnswer(res.text));
    };

    if (sendMsg) {
      getAns().then(() => {});
    }
  }, [sendMsg, dispatch, chatHistory.length]);

  const chatHistoryList = chatHistory.map((item, index) => {
    return (
      <Box key={index} className={item.msgType === 'question' ? 'question' : 'answer'}>
        <Typography>
          {item.msg}
        </Typography>
      </Box>
    );
  });

  return (
    <Stack>
      {chatHistoryList}
      {onProgress && <Box className={'answer'}>
        <Typography>
          {ans}
        </Typography>
      </Box>}
    </Stack>
  );
}

export default ChatBoard;
