import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/apollo';
import { SessionProvider } from 'next-auth/react';

import { useSession } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { NextComponentType } from 'next';

type AuthNextComponent = AppProps & { Component: { auth: boolean } };

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AuthNextComponent) {
  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider session={session}>
        <div className="">
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </SessionProvider>
    </ApolloProvider>
  );
}

const Auth = (props: PropsWithChildren) => {
  const { status } = useSession({ required: true });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
};
