import * as React from 'react';
import { OutlinedInput, IconButton, InputAdornment, Box, Stack, Container,
  Typography, CircularProgress } from "@mui/material";
import { Send, Loop, CropSquare } from "@mui/icons-material";
import { uiSlice, selectOnProgress } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";

const TextInput = () => {
  const [text, setText] = React.useState<string>("");
  const onProgress = useSelector(selectOnProgress);
  const dispatch = useDispatch();

  const handleSend = () => {
    if (text !== "") {
      dispatch(uiSlice.actions.changeQuestion(text));
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      setText(text + '\n');
    } else if (e.key === "Enter" && text !== "") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  return (
    <Box className={'input-container'}>
      <IconButton className={'generate-button'}>
        {onProgress ? <><CropSquare sx={{fontSize: 16, mr: 1}}/>Stop generating</> :
          <><Loop sx={{fontSize: 16, mr: 1}}/>Regenerate response</>}
      </IconButton>
      <Stack pt={4} pb={0}>
        <OutlinedInput
          multiline
          maxRows={8}
          className={'text-input'}
          placeholder={"Send a message..."}
          onKeyDown={handleKeyDown}
          onChange={handleTextChange}
          value={text}
          endAdornment={
            <InputAdornment position="end">
              {!onProgress ? <IconButton
                disabled={text === ""}
                onClick={handleSend}
              >
                <Send fontSize={'small'} sx={{ transform: 'rotate(-45deg)' }} />
              </IconButton> : <CircularProgress size={20} variant="indeterminate" sx={{color: 'grey'}} />}
            </InputAdornment>
          }
        />
        <Container sx={{ bgcolor: 'white', width: "42%", left: '50%', textAlign: 'center', p: 3 }} >
          <Typography fontSize={12} color={'grey'}>
            ChatGPT Mar 23 Version. ChatGPT may produce inaccurate information about people, places, or facts.
          </Typography>
        </Container>
      </Stack>
    </Box>
  );
};

export default TextInput;
