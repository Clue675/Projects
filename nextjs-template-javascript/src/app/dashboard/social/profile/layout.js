import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ChatText as ChatTextIcon } from '@phosphor-icons/react/dist/ssr/ChatText';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { UserPlus as UserPlusIcon } from '@phosphor-icons/react/dist/ssr/UserPlus';

import { config } from '@/config';
import { ProfileTabs } from '@/components/dashboard/social/profile-tabs';

export const metadata = { title: `Profile | Social | Dashboard | ${config.site.name}` };

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
      <Stack spacing={4}>
        <Stack spacing={4}>
          <Box
            sx={{
              backgroundImage: `url(/assets/image-abstract-2.png)`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              borderRadius: 1,
              height: '348px',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                alignItems: 'flex-end',
                bottom: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                left: 0,
                opacity: 0,
                p: 3,
                position: 'absolute',
                right: 0,
                top: 0,
                '&:hover': { opacity: '100%' },
              }}
            >
              <Button color="secondary" startIcon={<ImageIcon />} variant="contained">
                Change cover
              </Button>
            </Box>
          </Box>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Avatar src="/assets/avatar.png" sx={{ '--Avatar-size': '64px' }} />
              <div>
                <Typography variant="h6">Sofia Rivers</Typography>
                <Typography color="text.secondary" variant="overline">
                  Product Designer
                </Typography>
              </div>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: { md: 'flex', xs: 'none' } }}>
                <Button color="secondary" size="small" startIcon={<UserPlusIcon />}>
                  Connect
                </Button>
                <Button size="small" startIcon={<ChatTextIcon />} variant="contained">
                  Message
                </Button>
              </Stack>
              <Tooltip title="More options">
                <IconButton>
                  <DotsThreeIcon weight="bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={4}>
          <ProfileTabs />
          {children}
        </Stack>
      </Stack>
    </Box>
  );
}
