import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';

import { dayjs } from '@/lib/dayjs';

const tasks = [
  {
    id: 'TSK-006',
    title: 'Update the API for the project',
    dueDate: dayjs().add(1, 'hour').add(1, 'day').toDate(),
    members: [
      { name: 'Marcus Finn', avatar: '/assets/avatar-9.png' },
      { name: 'Carson Darrin', avatar: '/assets/avatar-3.png' },
    ],
  },
  {
    id: 'TSK-005',
    title: 'Redesign the landing page',
    dueDate: dayjs().add(1, 'hour').add(2, 'day').toDate(),
    members: [
      { name: 'Penjani Inyene', avatar: '/assets/avatar-4.png' },
      { name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
      { name: 'Nasimiyu Danai', avatar: '/assets/avatar-7.png' },
    ],
  },
  {
    id: 'TSK-004',
    title: 'Solve the bug for the showState',
    dueDate: dayjs().toDate(),
    members: [{ name: 'Miron Vitold', avatar: '/assets/avatar-1.png' }],
  },
  {
    id: 'TSK-003',
    title: 'Release v1.0 Beta',
    members: [
      { name: 'Marcus Finn', avatar: '/assets/avatar-9.png' },
      { name: 'Siegbert Gottfried', avatar: '/assets/avatar-2.png' },
    ],
  },
  {
    id: 'TSK-002',
    title: 'GDPR Compliance',
    members: [
      { name: 'Jie Yan', avatar: '/assets/avatar-8.png' },
      { name: 'Marcus Finn', avatar: '/assets/avatar-9.png' },
      { name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
    ],
  },
  {
    id: 'TSK-001',
    title: 'Redesign Landing Page',
    members: [{ name: 'Penjani Inyene', avatar: '/assets/avatar-4.png' }],
  },
];

function getDeadline(task) {
  let deadline = '';

  if (task.dueDate) {
    if (dayjs(task.dueDate).isAfter(Date.now())) {
      const daysLeft = dayjs(task.dueDate).diff(Date.now(), 'day');

      if (daysLeft < 3) {
        deadline = `${daysLeft} days remaining`;
      }
    }
  }

  return deadline;
}

export function GroupedList3() {
  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Card>
        <CardHeader
          action={
            <IconButton>
              <DotsThreeIcon weight="bold" />
            </IconButton>
          }
          title="Team tasks"
        />
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <List sx={{ minWidth: '400px' }}>
            {tasks.map((task, index) => (
              <ListItem divider={index < tasks.length - 1} key={task.id}>
                <ListItemText
                  disableTypography
                  primary={
                    <Link color="text.primary" noWrap sx={{ cursor: 'pointer' }} variant="subtitle2">
                      {task.title}
                    </Link>
                  }
                  secondary={
                    <Typography color="text.secondary" variant="body2">
                      {getDeadline(task)}
                    </Typography>
                  }
                />
                <AvatarGroup max={3}>
                  {task.members.map((member) => (
                    <Tooltip key={member.name} title="View">
                      <Avatar src={member.avatar} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </ListItem>
            ))}
          </List>
        </Box>
      </Card>
    </Box>
  );
}
