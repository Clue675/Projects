import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const user = {
  id: 'USR-000',
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  email: 'sofia@devias.io',
};

export function CompanyReviewAdd() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Avatar src={user.avatar} />
      <Stack spacing={3} sx={{ flex: '1 1 auto' }}>
        <OutlinedInput multiline placeholder="Send your review" rows={3} />
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
        >
          <Rating value={5} />
          <Button variant="contained">Send review</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
