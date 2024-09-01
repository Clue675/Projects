import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { SideNav } from '@/components/dashboard/settings/side-nav';

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ position: 'relative' }}>
        <SideNav />
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>{children}</Box>
      </Stack>
    </Box>
  );
}
