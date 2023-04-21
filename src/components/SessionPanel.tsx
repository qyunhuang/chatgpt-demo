import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ChatBubbleOutline, Add, DriveFileRenameOutline, DeleteOutlined } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';
import { uiSlice, selectSessionIds, selectCurSessionId } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";

const SessionPanel = () => {
  const dispatch = useDispatch();
  const sessionIds = useSelector(selectSessionIds);
  const curSessionId = useSelector(selectCurSessionId);

  const handleAddSession = () => {
    dispatch(uiSlice.actions.addSession(uuidv4()));
  }

  const handleSelectSession = (id: string) => {
    dispatch(uiSlice.actions.changeCurSessionId(id));
  }

  const handleDeleteSession = (id: string) => {
    dispatch(uiSlice.actions.deleteSession(id));
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

  const sessions = sessionIds.map((item, index) => {
    return (
      <Stack key={index} className={curSessionId === item ? 'session-selected' : 'session'}
             direction={'row'} justifyContent={'space-between'}
             onClick={() => handleSelectSession(item)}>
        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
          <ChatBubbleOutline sx={{ fontSize: 16 }} />
          <Typography key={index} fontSize={14}>
            {item.slice(0, 20)}
          </Typography>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
          <DriveFileRenameOutline sx={{ fontSize: 16 }} />
          <DeleteOutlined sx={{ fontSize: 16 }} onClick={() => handleDeleteSession(item)} />
        </Stack>
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
