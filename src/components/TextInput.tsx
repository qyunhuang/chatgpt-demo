import * as React from 'react';
import {OutlinedInput, IconButton, InputAdornment, Box, Stack, Container, Typography} from "@mui/material";
import { Send } from "@mui/icons-material";
import { uiSlice } from "../store/uiSlice";
import { useDispatch } from "react-redux";

const TextInput = () => {
  const [text, setText] = React.useState<string>("");
  const dispatch = useDispatch();

  const handleSend = () => {
    if (text !== "") {
      dispatch(uiSlice.actions.changeQustion(text));
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && text !== "") {
      handleSend();
    }
  };

  return (
    <Box sx={{ backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1))",
      position: "sticky", bottom: 0, height: '15vh' }}>
      <Stack pt={5} pb={0}>
        <OutlinedInput
          placeholder={"Send a message..."}
          onKeyDown={handleKeyDown}
          onChange={(e) => setText(e.target.value)}
          value={text}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={text === ""}
                onClick={handleSend}
              >
                <Send />
              </IconButton>
            </InputAdornment>
          }
          sx={{ width: "42%", height: '5vh', boxShadow: '1px 1px 8px #aaa', bgcolor: 'white', left: "50%", transform: "translateX(-50%)",
            "& fieldset": { borderColor: "white" }, "&:hover fieldset": { borderColor: "white !important" },
            "&.Mui-focused fieldset": { borderColor: "white !important" } }}
        />
        <Container sx={{ bgcolor: 'white', width: "42%", left: '50%', textAlign: 'center', p: 1.5 }} >
          <Typography fontSize={12} color={'grey'}>
            ChatGPT Mar 23 Version. ChatGPT may produce inaccurate information about people, places, or facts.
          </Typography>
        </Container>
      </Stack>
    </Box>
  );
};

export default TextInput;
