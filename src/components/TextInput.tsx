import * as React from 'react';
import { OutlinedInput, IconButton, InputAdornment } from "@mui/material";
import { Send } from "@mui/icons-material";
import { uiSlice } from "../store/uiSlice";
import { useDispatch } from "react-redux";

const TextInput = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleSend = () => {
    const value = inputRef.current?.value;
    if (value) {
      dispatch(uiSlice.actions.changeSendMsg(value));
      inputRef.current!.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <OutlinedInput
      inputRef={inputRef}
      placeholder={"Send a message..."}
      onKeyDown={handleKeyDown}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={handleSend}
          >
            <Send />
          </IconButton>
        </InputAdornment>
      }
      sx={{ width: "50%", position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)" }}
    />
  );
};

export default TextInput;
