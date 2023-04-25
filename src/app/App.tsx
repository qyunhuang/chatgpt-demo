import * as React from 'react';
import ChatBoard from "../components/ChatBoard";
import SlideDownButton from "../components/SlideDownButton";
import SessionPanel from "../components/SessionPanel";
import { Stack } from '@mui/material';
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Stack direction={'row'}>
        <SessionPanel />
        <Stack className={'chat-board'}>
          <Routes>
            <Route path={'/'} element={<ChatBoard />} />
            <Route path={'/:id'} element={<ChatBoard />} />
          </Routes>
        </Stack>
      </Stack>
      <SlideDownButton />
    </>
  );
};

export default App;
