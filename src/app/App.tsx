import * as React from 'react';
import TextInput from "../components/TextInput";
import Chat from "../components/Chat";
import { Stack } from '@mui/material';

const App = () => {
  return (
    <Stack>
      <Chat />
      <TextInput />
    </Stack>
  );
};

export default App;
