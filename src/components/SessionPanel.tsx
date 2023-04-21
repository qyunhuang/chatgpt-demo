import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ChatBubbleOutline, Add } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';
import { uiSlice } from "../store/uiSlice";
import { useDispatch } from "react-redux";

const SessionPanel = () => {
  const dispatch = useDispatch();
  const sessionArr = ['Echarts', 'Code', 'Text-to-image'];

  const handleAddSession = () => {
    dispatch(uiSlice.actions.addSession(uuidv4()));
  }

  const addSession = (
    <Stack
      className={'add-session'}
      direction={'row'}
      alignItems={'center'}
      spacing={1.5}
      onClick={handleAddSession}
    >
      <Add sx={{ fontSize: 16 }} />
      <Typography fontSize={14}>
        {'New chat'}
      </Typography>
    </Stack>
  );

  const sessions = sessionArr.map((item, index) => {
    return (
      <Stack key={index} className={'session'} direction={'row'} alignItems={'center'} spacing={1.5}>
        <ChatBubbleOutline sx={{ fontSize: 16 }} />
        <Typography key={index} fontSize={14}>
          {item}
        </Typography>
      </Stack>
    );
  });

  return (
    <Stack className={'session-panel'}>
      {addSession}
      {sessions}
    </Stack>
  );
};

export default SessionPanel;
