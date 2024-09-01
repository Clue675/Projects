import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { EmailNotifications } from '@/components/dashboard/settings/email-notifications';
import { PhoneNotifications } from '@/components/dashboard/settings/phone-notifications';

export const metadata = { title: `Notifications | Settings | Dashboard | ${config.site.name}` };

export default function Page() {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">Notifications</Typography>
      </div>
      <Stack spacing={4}>
        <EmailNotifications />
        <PhoneNotifications />
      </Stack>
    </Stack>
  );
}
