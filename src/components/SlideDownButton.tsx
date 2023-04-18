import * as React from 'react';
import { IconButton } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

const SlideDownButton = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  return (
    <IconButton
      size={'small'}
      onClick={handleScroll}
      sx={{ position: "fixed", bottom: '12vh', right: 0, m: 3, border: '1px solid #ddd' }}
    >
      <ArrowDownward fontSize={'small'} />
    </IconButton>
  );
};

export default SlideDownButton;
