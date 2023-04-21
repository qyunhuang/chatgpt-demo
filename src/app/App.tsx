import * as React from 'react';
import TextInput from "../components/TextInput";
import ChatBoard from "../components/ChatBoard";
import SlideDownButton from "../components/SlideDownButton";
import SessionPanel from "../components/SessionPanel";
import { Stack } from '@mui/material';

const App = () => {
  return (
    <>
      <Stack direction={'row'}>
        <SessionPanel />
        <Stack className={'chat-board'}>
          <ChatBoard />
          <TextInput />
        </Stack>
      </Stack>
      <SlideDownButton />
    </>
  );
};

export default App;
