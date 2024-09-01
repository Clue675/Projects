import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { config } from '@/config';

export const metadata = { title: `Blank | Dashboard | ${config.site.name}` };

export default function Page() {
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Blank</Typography>
          </Box>
          <div>
            <Button startIcon={<PlusIcon />} variant="contained">
              Action
            </Button>
          </div>
        </Stack>
        <Box sx={{ border: '1px dashed var(--mui-palette-divider)', height: '300px', p: '4px' }} />
      </Stack>
    </Box>
  );
}
