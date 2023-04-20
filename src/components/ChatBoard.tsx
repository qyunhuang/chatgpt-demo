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
  }, [sendMsg, dispatch, chatHistory.length]);

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

  const emphasisBlocks = (text: string) => text.split('`').map((item, index) => {
    if (index % 2 === 0) {
      return (
        <Typography component={'span'} key={index}>
          {item}
        </Typography>
      );
    }

    return (
      <Typography key={index} component={'span'} color={'#111827'} fontSize={15} fontWeight={600}>
        {`\`${item}\``}
      </Typography>
    );
  });

  const echartsOption = (code: string): null | object => {
    if (!code.split('option = ')[1]) {
      return null;
    }

    const option = code.split('option = ')[1]
      .replace(/\/\/.*$/gm, '')  // remove comments
      .replace(/(\b\w+\b)(?=:)/g, '"$1"')  // add double quotes to keys
      .replace(/'/g, '"')  // replace single quotes with double quotes
      .replace(/\n/g, "")  // remove \n
      .replace(/[^\S\r\n]/g, '')  // remove whitespace
      .replace(/;/g, "");  // remove ;

    if (!option.match(/^{.*}$/)) {
      return null;
    }

    return JSON.parse(option);
  }

  const codeBlocks = (text: string) => text.split('```').map((item, index) => {
    if (index % 2 === 0) {
      return (
        <React.Fragment key={index}>
          {emphasisBlocks(item)}
        </React.Fragment>
      );
    }

    const lang = item.split('\n')[0] || 'jsx';
    const code = item.slice(item.indexOf('\n') + 1);
    const option = echartsOption(code);

    return (
      <Stack key={index}>
        <CodeBlock code={code} language={lang} />
        {option && <Echart option={option} />}
      </Stack>
    );
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
    </Stack>
  );
}

export default ChatBoard;
