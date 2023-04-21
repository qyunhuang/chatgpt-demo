import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ChatBubbleOutline, Add } from "@mui/icons-material";

const SessionPanel = () => {
  const sessionArr = ['Echarts', 'Code', 'Text-to-image'];

  const addSession = (
    <Stack className={'add-session'} direction={'row'} alignItems={'center'} spacing={1.5}>
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
