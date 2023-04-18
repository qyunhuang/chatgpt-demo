import * as React from 'react';
import { config } from "../config/config";
import { ChatGPTAPI } from "chatgpt";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Stack, Typography, Box } from "@mui/material";
import { selectSendMsg } from "../store/uiSlice";
import { useSelector } from 'react-redux';

const Chat = () => {
  const [ans, setAns] = React.useState<undefined | string>("");
  const sendMsg = useSelector(selectSendMsg);

  React.useEffect(() => {
    const getAns = async () => {
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

      await api.sendMessage(sendMsg, {
        onProgress: r => setAns(r.text),
      });
    };

    if (sendMsg) {
      getAns().then(() => {});
    }
  }, [sendMsg]);

  return (
    <Stack>
      <Box sx={{ py: 3, px: '30vw', bgcolor: '#f3f3f3' }}>
        <Typography>
          {sendMsg}
        </Typography>
      </Box>
      <Box sx={{ py: 3, px: '30vw', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
        <Typography>
          {ans}
        </Typography>
      </Box>
    </Stack>
  );
}

export default Chat;
