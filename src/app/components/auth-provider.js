'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}