import * as React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Stack, Typography, IconButton, Box } from '@mui/material';
import { ContentCopy, Check } from "@mui/icons-material";

interface ICodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = (props: ICodeBlockProps) => {
  const { code, language } = props;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Stack>
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} className={'copy-to-clipboard'}>
          <Typography className={'lang'}>
            {language}
          </Typography>
          <IconButton className={'copy-button'}>
            {copied ? <Check fontSize={'small'} /> : <ContentCopy fontSize={'small'} />}
            <Box ml={1}>
              {copied ? "Copied!" : "Copy Code"}
            </Box>
          </IconButton>
        </Stack>
      </CopyToClipboard>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLines={true}
        customStyle={{ marginTop: 0, marginBottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0,
          backgroundColor: 'black', fontSize: '0.875em' }}
      >
        {code}
      </SyntaxHighlighter>
    </Stack>
  );
}

export default CodeBlock;
