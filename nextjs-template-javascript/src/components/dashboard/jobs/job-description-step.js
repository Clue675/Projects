'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { TextEditor } from '@/components/core/text-editor/text-editor';

export function JobDescriptionStep({ onBack, onNext }) {
  const [content, setContent] = React.useState('');

  const handleContentChange = React.useCallback(({ editor }) => {
    setContent(editor.getText());
  }, []);

  return (
    <Stack spacing={4}>
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">How would you describe the job post?</Typography>
        </div>
        <Box sx={{ '& .tiptap-container': { height: '400px' } }}>
          <TextEditor content={content} onUpdate={handleContentChange} placeholder="Write something" />
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button color="secondary" onClick={onBack} startIcon={<ArrowLeftIcon />}>
          Back
        </Button>
        <Button onClick={onNext} variant="contained">
          Create job
        </Button>
      </Stack>
    </Stack>
  );
}
