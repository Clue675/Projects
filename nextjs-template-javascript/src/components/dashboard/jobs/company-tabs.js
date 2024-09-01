'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from '@/paths';

const tabs = [
  { label: 'Overview', value: 'overview', href: paths.dashboard.jobs.companies.overview('1') },
  { label: 'Reviews', value: 'reviews', href: paths.dashboard.jobs.companies.reviews('1') },
  { label: 'Activity', value: 'activity', href: paths.dashboard.jobs.companies.activity('1') },
  { label: 'Team', value: 'team', href: paths.dashboard.jobs.companies.team('1') },
  { label: 'Assets', value: 'assets', href: paths.dashboard.jobs.companies.assets('1') },
];

function useSegment() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return segments[4] ?? 'overview';
}

export function CompanyTabs() {
  const segment = useSegment();

  return (
    <Tabs sx={{ px: 3 }} value={segment} variant="scrollable">
      {tabs.map((tab) => (
        <Tab {...tab} component={RouterLink} key={tab.value} tabIndex={0} />
      ))}
    </Tabs>
  );
}
