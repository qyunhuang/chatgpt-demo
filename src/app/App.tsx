import * as React from 'react';
import TextInput from "../components/TextInput";
import ChatBoard from "../components/ChatBoard";
import { Stack } from '@mui/material';

const App = () => {
  return (
    <Stack>
      <ChatBoard />
      <TextInput />
    </Stack>
  );
};

export default App;
