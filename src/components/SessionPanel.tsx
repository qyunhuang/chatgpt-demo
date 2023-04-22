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
  const [isEditingArr, setIsEditingArr] = React.useState<{ [key: string]: boolean }>({});
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
    setIsEditingArr({ ...isEditingArr, [id]: false });
  }

  const handleRenameSessionKey = (e: React.KeyboardEvent<HTMLSpanElement>, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const name = (e.target as HTMLSpanElement).innerText;
      dispatch(uiSlice.actions.renameSession({ id, name }));
      (e.target as HTMLSpanElement).blur();
      setIsEditingArr({ ...isEditingArr, [id]: false });
    }
  }

  const handleEditSessionName = (id: string) => {
    setIsEditingArr({ ...isEditingArr, [id]: true });
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
    const isEditing = isEditingArr[item];

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
          {isEditing ?
          <Check sx={{fontSize: 16}} onClick={() => handleEditSessionName(item)}/> :
          <Stack direction={'row'} spacing={0.5}>
            <DriveFileRenameOutline sx={{fontSize: 16}} onClick={() => handleEditSessionName(item)}/>
            <DeleteOutlined sx={{fontSize: 16}} onClick={() => handleDeleteSession(item)}/>
          </Stack>}
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
