import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { Link as LinkIcon } from '@phosphor-icons/react/dist/ssr/Link';
import { Paperclip as PaperclipIcon } from '@phosphor-icons/react/dist/ssr/Paperclip';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Smiley as SmileyIcon } from '@phosphor-icons/react/dist/ssr/Smiley';

const user = {
  id: 'USR-000',
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  email: 'sofia@devias.io',
};

export function PostAdd() {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Avatar src={user.avatar} />
          <Stack spacing={3} sx={{ flex: '1 1 auto' }}>
            <OutlinedInput multiline placeholder="What's on your mind" rows={3} />
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <IconButton sx={{ display: { sm: 'none' } }}>
                  <PlusIcon />
                </IconButton>
                <IconButton sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  <ImageIcon />
                </IconButton>
                <IconButton sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  <PaperclipIcon />
                </IconButton>
                <IconButton sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  <LinkIcon />
                </IconButton>
                <IconButton sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  <SmileyIcon />
                </IconButton>
              </Stack>
              <div>
                <Button variant="contained">Post</Button>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
