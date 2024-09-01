import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import { CenteredLayout } from '@/components/auth/centered-layout';
import { DynamicLogo } from '@/components/core/logo';

export const metadata = { title: `Reset password | Samples | Auth | ${config.site.name}` };

export default function Page() {
  return (
    <CenteredLayout>
      <Stack spacing={4}>
        <div>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.overview}
            sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
            variant="subtitle2"
          >
            <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
            Dashboard
          </Link>
        </div>
        <div>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Box>
        </div>
        <Card>
          <CardHeader title="Reset password" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput name="email" type="email" />
              </FormControl>
              <Button type="submit" variant="contained">
                Send recovery link
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </CenteredLayout>
  );
}
