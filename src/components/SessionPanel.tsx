import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ChatBubbleOutline, Add, DriveFileRenameOutline, DeleteOutlined, Check } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';
import { uiSlice, selectSessionIds, selectCurSessionId, selectSessionNames } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";

const SessionPanel = () => {
  const dispatch = useDispatch();
  const sessionIds = useSelector(selectSessionIds);
  const curSessionId = useSelector(selectCurSessionId);
  const sessionNames = useSelector(selectSessionNames);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const sessionNameRefs = React.useRef<{ [key: string]: HTMLSpanElement | null }>({});

  const handleAddSession = () => {
    dispatch(uiSlice.actions.addSession(uuidv4()));
  }

  const handleSelectSession = (id: string) => {
    dispatch(uiSlice.actions.changeCurSessionId(id));
  }

  const handleDeleteSession = (id: string) => {
    dispatch(uiSlice.actions.deleteSession(id));
  }

  const handleRenameSession = (e: React.FormEvent<HTMLSpanElement>, id: string) => {
    const name = (e.target as HTMLSpanElement).innerText;
    dispatch(uiSlice.actions.renameSession({ id, name }));
    setIsEditing(false);
  }

  const handleRenameSessionKey = (e: React.KeyboardEvent<HTMLSpanElement>, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const name = (e.target as HTMLSpanElement).innerText;
      dispatch(uiSlice.actions.renameSession({ id, name }));
      (e.target as HTMLSpanElement).blur();
      setIsEditing(false);
    }
  }

  const handleEditSessionName = (id: string) => {
    setIsEditing(true);
    setTimeout(() => {
      sessionNameRefs.current[id]?.focus();
    }, 0);
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
          <Typography
            key={index}
            ref={(element) => sessionNameRefs.current[item] = element}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(event) => handleRenameSession(event, item)}
            onKeyDown={(event) => handleRenameSessionKey(event, item)}
            fontSize={14}
          >
            {sessionNames[index]}
          </Typography>
        </Stack>
          {curSessionId === item && (isEditing ?
          <Check className={'session-icon'} onClick={() => handleEditSessionName(item)}/> :
          <Stack direction={'row'} spacing={0.5}>
            <DriveFileRenameOutline className={'session-icon'} onClick={() => handleEditSessionName(item)}/>
            <DeleteOutlined className={'session-icon'} onClick={() => handleDeleteSession(item)}/>
          </Stack>)}
      </Stack>
    );
  });

  return (
    <Stack className={'session-panel'}>
      {addSession}
      <Stack className={'session-list'}>
        {sessions}
      </Stack>
    </Stack>
  );
};

export default SessionPanel;