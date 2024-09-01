'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { paths } from '@/paths';
import { useMediaQuery } from '@/hooks/use-media-query';

import { LabelItem } from './label-item';

function groupLabels(labels) {
  const groups = { system: [], custom: [] };

  labels.forEach((label) => {
    if (label.type === 'system') {
      groups.system.push(label);
    } else {
      groups.custom.push(label);
    }
  });

  return groups;
}

export function Sidebar({ currentLabelId, labels, onCloseMobile, onCompose, openDesktop = false, openMobile = false }) {
  const mdUp = useMediaQuery('up', 'md');

  const content = (
    <SidebarContent
      closeOnSelect={!mdUp}
      currentLabelId={currentLabelId}
      labels={labels}
      onClose={onCloseMobile}
      onCompose={onCompose}
    />
  );

  if (mdUp) {
    return (
      <Box
        sx={{
          borderRight: '1px solid var(--mui-palette-divider)',
          flex: '0 0 auto',
          ml: openDesktop ? 0 : '-320px',
          position: 'relative',
          transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
          width: '320px',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Drawer PaperProps={{ sx: { maxWidth: '100%', width: '320px' } }} onClose={onCloseMobile} open={openMobile}>
      {content}
    </Drawer>
  );
}

function SidebarContent({ closeOnSelect, currentLabelId, labels, onClose, onCompose }) {
  const router = useRouter();

  const handleLabelSelect = React.useCallback(
    (labelId) => {
      if (closeOnSelect) {
        onClose?.();
      }

      const href = paths.dashboard.mail.list(labelId);

      router.push(href);
    },
    [router, closeOnSelect, onClose]
  );

  // Maybe use memo
  const groupedLabels = groupLabels(labels);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing={1} sx={{ flex: '0 0 auto', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Mailbox</Typography>
          <IconButton onClick={onClose} sx={{ display: { md: 'none' } }}>
            <XIcon />
          </IconButton>
        </Stack>
        <Button onClick={onCompose} startIcon={<PlusIcon />} variant="contained">
          Compose
        </Button>
      </Stack>
      <Divider />
      <Box sx={{ flex: '1 1 auto', overflowY: 'auto', p: 2 }}>
        {Object.keys(groupedLabels).map((type) => (
          <React.Fragment key={type}>
            {type === 'custom' ? (
              <ListSubheader disableSticky>
                <Typography color="text.secondary" variant="overline">
                  Custom Labels
                </Typography>
              </ListSubheader>
            ) : null}
            <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {groupedLabels[type].map((label) => (
                <LabelItem
                  active={currentLabelId === label.id}
                  key={label.id}
                  label={label}
                  onSelect={() => {
                    handleLabelSelect(label.id);
                  }}
                />
              ))}
            </Stack>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
