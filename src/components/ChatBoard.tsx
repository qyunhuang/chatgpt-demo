import * as React from 'react';
import { config } from "../config/config";
import { ChatGPTAPI } from "chatgpt";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Stack, Typography, Box } from "@mui/material";
import { selectSendMsg, selectHistory } from "../store/uiSlice";
import { useSelector, useDispatch } from 'react-redux';
import { uiSlice } from "../store/uiSlice";
import CodeBlock from "./CodeBlock";
import { useThrottledCallback } from "use-debounce";
import Echart from "./Echart";
import { useParams } from "react-router-dom";
import TextInput from "./TextInput";

const ChatBoard = () => {
  const [ans, setAns] = React.useState<string>("");
  const [onProgress, setOnProgress] = React.useState<boolean>(false);
  const sendMsg = useSelector(selectSendMsg);
  const chatHistory = useSelector(selectHistory);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    if (id) {
      dispatch(uiSlice.actions.changeCurSessionId(id));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    const getAns = async () => {
      if (!sendMsg) return;

      if (chatHistory && chatHistory.length % 2 === 0) {
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
          dispatch(uiSlice.actions.changeOnProgress(true));
          setAns(r.text);
          dispatch(uiSlice.actions.changeCurAnswer(r.text));
        },
      });

      console.log(res.text);

      setOnProgress(false);
      dispatch(uiSlice.actions.changeOnProgress(false));

      window.scrollTo({
        top: document.body.scrollHeight
      });
    };

    if (sendMsg) {
      getAns().then(() => {});

      window.scrollTo({
        top: document.body.scrollHeight
      });
    }
  }, [sendMsg, dispatch, chatHistory]);

  const throttledScrollToBottom = useThrottledCallback(() => {
    window.scrollTo({
      top: document.body.scrollHeight
    });
  }, 200, { leading: true, trailing: false });

  React.useEffect(() => {
    if (onProgress) {
      throttledScrollToBottom();
    }
  }, [ans, onProgress, throttledScrollToBottom]);

  const textBlocks = (text: string) => text.split('`').map((item, index) => {
    if (index % 2 === 0) {
      return (
        <Typography whiteSpace="pre-wrap" component={'span'} key={index}>
          {item.replace(/^\s+|\s+$/g, '')}
        </Typography>
      );
    }

    return (
      <Typography key={index} component={'span'} color={'#111827'} fontSize={15} fontWeight={600}>
        {`\`${item}\``}
      </Typography>
    );
  });


  const chatMsg = (text: string) => text.split('```').map((item, index) => {
    if (index % 2 === 0) {
      return (
        <React.Fragment key={index}>
          {textBlocks(item)}
        </React.Fragment>
      );
    }

    const lang = item.split('\n')[0] || 'jsx';
    const code = item.slice(item.indexOf('\n') + 1);

    return (
      <Stack key={index}>
        <CodeBlock code={code} language={lang} />
        <Echart option={code} />
      </Stack>
    );
  });

  const chatHistoryList =  chatHistory?.map((item, index) => {
    return (
      <Box key={index} className={item.msgType === 'question' ? 'question' : 'answer'}>
        {chatMsg(item.msg)}
      </Box>
    );
  });

  return (
    <>
      <Stack>
        {chatHistoryList}
      </Stack>
      <TextInput />
    </>
  );
}

export default ChatBoard;
