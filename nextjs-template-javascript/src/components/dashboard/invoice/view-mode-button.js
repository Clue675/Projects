'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { Rows as RowsIcon } from '@phosphor-icons/react/dist/ssr/Rows';

import { paths } from '@/paths';

export function ViewModeButton({ view }) {
  const router = useRouter();

  const handleViewChange = React.useCallback(
    (value) => {
      // Make sure to keep the search params when changing the view mode.
      // For the sake of simplicity, we did not keep the search params on mode change.

      if (value) {
        router.push(`${paths.dashboard.invoices.list}?view=${value}`);
      }
    },
    [router]
  );

  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      onChange={(_, value) => {
        handleViewChange(value);
      }}
      onKeyUp={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleViewChange(view === 'group' ? 'list' : 'group');
        }
      }}
      tabIndex={0}
      value={view}
    >
      <ToggleButton value="group">
        <RowsIcon />
      </ToggleButton>
      <ToggleButton value="list">
        <ListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
