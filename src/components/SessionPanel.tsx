import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ChatBubbleOutline, Add, DriveFileRenameOutline, DeleteOutlined, Check } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';
import { uiSlice, selectSessionIds, selectCurSessionId, selectSessionNames } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { addSession, renameSession, deleteSession } from '../utils/request';

const SessionPanel = () => {
  const dispatch = useDispatch();
  const sessionIds = useSelector(selectSessionIds);
  const curSessionId = useSelector(selectCurSessionId);
  const sessionNames = useSelector(selectSessionNames);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const sessionNameRefs = React.useRef<{ [key: string]: HTMLSpanElement | null }>({});

  React.useEffect(() => {
    if (curSessionId) {
      navigate(`/${curSessionId}`);
    }
  }, [curSessionId, navigate]);

  const handleAddSession = () => {
    const sessionId = uuidv4();
    dispatch(uiSlice.actions.addSession(sessionId));
    addSession(1, sessionId);
  }

  const handleSelectSession = (id: string) => {
    dispatch(uiSlice.actions.changeCurSessionId(id));
  }

  const handleDeleteSession = (id: string) => {
    dispatch(uiSlice.actions.deleteSession(id));
    deleteSession(id);
  }

  const handleRenameSession = (e: React.FormEvent<HTMLSpanElement>, id: string) => {
    const name = (e.target as HTMLSpanElement).innerText;
    dispatch(uiSlice.actions.renameSession({ id, name }));
    renameSession(id, name);
    setIsEditing(false);
  }

  const handleRenameSessionKey = (e: React.KeyboardEvent<HTMLSpanElement>, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const name = (e.target as HTMLSpanElement).innerText;
      dispatch(uiSlice.actions.renameSession({ id, name }));
      renameSession(id, name);
      (e.target as HTMLSpanElement).blur();
      setIsEditing(false);
    }
  }

  const handleEditSessionName = (id: string) => {
    setIsEditing(true);
    setTimeout(() => {
      sessionNameRefs.current[id]?.focus();
    }, 0);

    const range = document.createRange();
    range.selectNodeContents(sessionNameRefs.current[id] as Node);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  const addSessionButton = (
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
            className={isEditing ? 'session-name-editing' : 'session-name'}
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
      {addSessionButton}
      <Stack className={'session-list'}>
        {sessions}
      </Stack>
    </Stack>
  );
};

export default SessionPanel;
