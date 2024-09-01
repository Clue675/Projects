'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Select from '@mui/material/Select';

import { paths } from '@/paths';
import { Option } from '@/components/core/option';

export function InvoicesSort({ filters = {}, sortDir = 'desc', view }) {
  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newSortDir) => {
      const searchParams = new URLSearchParams();

      // Make sure to keep the search params when changing the sort.
      // For the sake of simplicity, we keep only the view search param on sort change.

      if (view) {
        searchParams.set('view', view);
      }

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (filters.status) {
        searchParams.set('status', filters.status);
      }

      if (filters.id) {
        searchParams.set('id', filters.id);
      }

      if (filters.customer) {
        searchParams.set('customer', filters.customer);
      }

      if (filters.startDate) {
        searchParams.set('startDate', filters.startDate);
      }

      if (filters.endDate) {
        searchParams.set('endDate', filters.endDate);
      }

      router.push(`${paths.dashboard.invoices.list}?${searchParams.toString()}`);
    },
    [router, view, filters]
  );

  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(event.target.value);
    },
    [updateSearchParams]
  );

  return (
    <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: '100%', width: '120px' }} value={sortDir}>
      <Option value="desc">Newest</Option>
      <Option value="asc">Oldest</Option>
    </Select>
  );
}
