import { getAllTools, getUsers } from '@/graphql/queries';
import { Tool } from '@/lib/dump-data/types';
import { useQuery } from '@apollo/client';

import { signOut, useSession } from 'next-auth/react';

import { GetServerSidePropsContext } from 'next';
import { getServerSession, Session } from 'next-auth';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';
import Navbar from '@/components/navbar/Navbar';
import { useMemo } from 'react';

export default function App(props: { session: string }) {
  // NextAuth session custom webhook data
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(getUsers);

  let session = useSession();
  // console.log(session);

  const { loading, error, data } = useQuery(getAllTools);
  if (loading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  let expireDate;
  if (session && session.data) {
    expireDate = new Date(session.data.expires).toDateString();
  }

  if (error) {
    return (
      <>
        <div>Error :{error.message}</div>;
      </>
    );
  }

  return (
    <>
      <div className="min-h-full">
        <div className="bg-indigo-600 pb-32">
          <Navbar />
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Dashboard
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {/* Your content */}
          </div>
        </main>
      </div>
    </>
  );
}

App.auth = true;

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: { session: Session | null } }> {
  const a = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: JSON.parse(JSON.stringify(a)),
    },
  };
}
