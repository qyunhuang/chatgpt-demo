import * as React from 'react';
import { IconButton } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import useWindowBottom  from "../hooks/useWindowBottom";

const SlideDownButton = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isWindowBottom] = useWindowBottom();

  const handleClick = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  React.useEffect(() => {
    if (isWindowBottom) {
      buttonRef.current?.setAttribute('style', 'display: none');
    } else {
      buttonRef.current?.setAttribute('style', 'display: flex');
    }
  }, [isWindowBottom]);

 return (
    <IconButton
      ref={buttonRef}
      onClick={handleClick}
      sx={{ position: "fixed", bottom: '12vh', right: 0, m: 3, border: '1px solid #ddd', width: 30, height: 30 }}
    >
      <ArrowDownward fontSize={'small'} />
    </IconButton>
  );
};

export default SlideDownButton;
