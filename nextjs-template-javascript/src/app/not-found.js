import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { paths } from '@/paths';

export const metadata = { title: `Not found | ${config.site.name}` };

export default function NotFound() {
  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100%',
        py: '64px',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              alt="Not found"
              component="img"
              src="/assets/not-found.svg"
              sx={{ height: 'auto', maxWidth: '100%', width: '200px' }}
            />
          </Box>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h4">404: The page you are looking for isn&apos;t here</Typography>
            <Typography color="text.secondary">
              You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button component={RouterLink} href={paths.home} variant="contained">
              Back to home
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
