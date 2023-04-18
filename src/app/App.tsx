import * as React from 'react';
import TextInput from "../components/TextInput";
import ChatBoard from "../components/ChatBoard";
import SlideDownButton from "../components/SlideDownButton";
import { Stack } from '@mui/material';

const App = () => {
  return (
    <>
      <Stack>
        <ChatBoard />
        <TextInput />
      </Stack>
      <SlideDownButton />
    </>
  );
};

export default App;
