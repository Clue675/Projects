import * as React from 'react';

import { config } from '@/config';
import { SignInForm } from '@/components/auth/custom/sign-in-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';

export const metadata = { title: `Sign in | Custom | Auth | ${config.site.name}` };

export default function Page() {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignInForm />
      </SplitLayout>
    </GuestGuard>
  );
}
