import * as React from 'react';
// import { config } from "../config/config";
// import { ChatGPTAPI } from "chatgpt";
// import { HttpsProxyAgent } from "https-proxy-agent";
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

const ChatBoard = () => {
  const [ans, setAns] = React.useState<string>("");
  const [onProgress, setOnProgress] = React.useState<boolean>(false);
  const sendMsg = useSelector(selectSendMsg);
  const questionRepeat = useSelector(selectquestionRepeat);
  const chatHistory = useSelector(selectHistory);
  const curSessionId = useSelector(selectCurSessionId);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    if (id) {
      dispatch(uiSlice.actions.changeCurSessionId(id));
    }
  }, [id, dispatch]);

  // show message history when session id changes
  React.useEffect(() => {
    const getHistory = async () => {
      const res = await selectMessage(curSessionId as string);
      const history: IMsg[] = res.data.messages.map((msg: any, idx: number) => {
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
    const getAns = async () => {
      if (!sendMsg) return;

      // if (chatHistory && chatHistory.length % 2 === 0) {
      //   return;
      // }

      // const options = {
      //   apiKey: config.api,
      //   debug: true,
      // };

      // const api = new ChatGPTAPI({
      //   ...options, // Spread operator to include any additional options provided to ChatGPTAPI constructor
      //   fetch: (url, options = {}) => {
      //     const defaultOptions = {
      //       agent: new HttpsProxyAgent({host: config.proxyHost, port: config.proxyPort}), // Update to pass proxy server information correctly
      //     }
      //     const mergedOptions = {
      //       ...defaultOptions,
      //       ...options, // Spread operator to override defaultOptions with any options provided to the fetch function
      //     }
      //     return fetch(url, mergedOptions) // Return fetch function with merged options
      //   },
      // });

      // await api.sendMessage(sendMsg, {
      //   systemMessage: '',
      //   onProgress: r => {
      //     setOnProgress(true);
      //     dispatch(uiSlice.actions.changeOnProgress(true));
      //     setAns(r.text);
      //     dispatch(uiSlice.actions.changeCurAnswer(r.text));
      //   },
      // }).then((res) => {
      //   console.log(res.text);
      //   setOnProgress(false);
      //   dispatch(uiSlice.actions.changeOnProgress(false));
      //   addMessage(curSessionId as string, res.text, false);
      // });

      const apiTest = (time: number) => {
        return new Promise((resolve) => {
          let timesRun = 0;
          let timeCount = 30;
          const text = `在Redux中使用axios请求数据的一般流程是:

          在组件中调用Redux action creator,触发action
          在Redux reducer中处理action,更新state
          在组件中使用state
          在这个流程中,第1步可以通过组件的componentDidMount()生命周期函数来实现,即在组件挂载后立即调用action creator。在action creator中使用axios发起请求,请求完成后将返回的数据作为action的payload,dispatch这个action到reducer中进行处理。
          
          下面是一个使用axios请求数据并将其存储到Redux state中的示例:`;

          const interval = setInterval(() => {
            timesRun += 1;

            setOnProgress(true);
            dispatch(uiSlice.actions.changeOnProgress(true));
            setAns(text);
            dispatch(uiSlice.actions.changeCurAnswer(text.slice(0, timesRun * (text.length / timeCount))));

            
            window.scrollTo({
              top: document.body.scrollHeight
            });

            if (timesRun === timeCount) {
              clearInterval(interval);
              resolve(text);
            }
          }, time);
        });
      }

      await apiTest(50).then((res) => {
        console.log('done');
        setOnProgress(false);
        dispatch(uiSlice.actions.changeOnProgress(false));
        addMessage(curSessionId as string, res as string, false);
      });
    };

    if (sendMsg) {
      getAns();

      window.scrollTo({
        top: document.body.scrollHeight
      });
    }
  }, [sendMsg, dispatch, curSessionId, questionRepeat]); // what if sendMsg is not different?

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
