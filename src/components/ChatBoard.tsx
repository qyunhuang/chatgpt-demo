import * as React from 'react';
import { config } from "../config/config";
import { ChatGPTAPI } from "chatgpt";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Stack, Typography, Box } from "@mui/material";
import { selectSendMsg, selectquestionRepeat, selectCurSessionId, selectHistory } from "../store/uiSlice";
import { useSelector, useDispatch } from 'react-redux';
import { uiSlice, IMsg } from "../store/uiSlice";
import CodeBlock from "./CodeBlock";
import { useThrottledCallback } from "use-debounce";
import Echart from "./Echart";
import { useParams } from "react-router-dom";
import TextInput from "./TextInput";
import { addMessage, selectMessage } from "../utils/request";
import { Message } from '../types';

const ChatBoard = () => {
  const [ans, setAns] = React.useState<string>("");
  const [onProgress, setOnProgress] = React.useState<boolean>(false);
  const sendMsg = useSelector(selectSendMsg);
  const questionRepeat = useSelector(selectquestionRepeat);
  const chatHistory = useSelector(selectHistory);
  const curSessionId = useSelector(selectCurSessionId);
  const prevSessionId = React.useRef<string>("");
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  // change session id when url changes
  React.useEffect(() => {
    if (id) {
      dispatch(uiSlice.actions.changeCurSessionId(id));
    }
  }, [id, dispatch]);

  // show message history when session id changes
  React.useEffect(() => {
    const getHistory = async () => {
      const messages: Message[] = (await selectMessage(curSessionId as string)).data.messages;
      const history: IMsg[] = messages.map((msg: Message, idx: number) => {
        return {
          id: idx,
          msg: msg.content,
          msgType: msg.question ? 'question' : 'answer',
        };
      });
      dispatch(uiSlice.actions.initHistory(history));
    };

    getHistory();
  }, [curSessionId, dispatch]);

  React.useEffect(() => {
    // when session id changes, don't send message
    if (prevSessionId.current !== curSessionId) {
      prevSessionId.current = curSessionId as string;
      return;
    }
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

      await api.sendMessage(sendMsg, {
        systemMessage: '',
        onProgress: r => {
          setOnProgress(true);
          dispatch(uiSlice.actions.changeOnProgress(true));
          setAns(r.text);
          dispatch(uiSlice.actions.changeCurAnswer(r.text));
        },
      }).then((res) => {
        setOnProgress(false);
        dispatch(uiSlice.actions.changeOnProgress(false));
        addMessage(curSessionId as string, res.text, false);
      });
    };

    if (sendMsg && sendMsg !== '') {
      getAns();

      window.scrollTo({
        top: document.body.scrollHeight
      });
    }
  }, [sendMsg, dispatch, questionRepeat, curSessionId]);

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
    const code = item.slice(item.indexOf('\n') + 1).replace(/\n(?!.*\n)/, "");

    return (
      <Stack key={index}>
        <CodeBlock code={code} language={lang} />
        <Echart option={code} />
      </Stack>
    );
  });

  const chatHistoryList = chatHistory?.map((item, index) => {
    return (
      <Box key={index} className={item.msgType === 'question' ? 'question' : 'answer'}>
        {chatMsg(item.msg)}
      </Box>
    );
  });

  const blank = (
    <Box className="question" sx={{ height: '15vh' }}></Box>
  );

  return (
    <>
      <Stack>
        {chatHistoryList}
        {blank}
      </Stack>
      <TextInput />
    </>
  );
}

export default ChatBoard;
