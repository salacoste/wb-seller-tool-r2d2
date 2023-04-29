import { getAllTools, getUsers } from '@/graphql/queries';
import { Tool } from '@/lib/dump-data/types';
import { useQuery } from '@apollo/client';

import { signOut, useSession } from 'next-auth/react';

import { GetServerSidePropsContext } from 'next';
import { getServerSession, Session } from 'next-auth';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';

export default function TailwindPage(props: { session: string }) {
  // NextAuth session custom webhook data
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(getUsers);

  let session = useSession();
  console.log(session);

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
      <div className="container mx-auto">
        <nav className="flex mt-3">
          <ul className="flex-1 flex sm:gap-10 gap-3 justify-start items-center">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/tools">Tools</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
          <ul className=" flex">
            <li>
              <Link
                href="/auth/signout"
                passHref
                className="btn  btn-ghost btn-outline"
                onClick={() => signOut()}
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        <h1 className="text-3xl text-center my-4">Tools</h1>
        <div className="grid grid-cols-2 grid-rows-1">
          <div></div>
          <div className="text-right text-primary p-4 my-2">
            <p>{`Hello ${session?.data?.user?.name}. Long time did not hear you!`}</p>
            {expireDate && <p>{`Session will expire at ${expireDate}`}</p>}
          </div>
        </div>
        <div className="divider-horizontal h-2 w-full"></div>
        <ul className="flex-1 prose lg:prose-xl">
          {data?.getTools?.map((tool: Tool) => (
            <li key={tool.id} className="w-full mb-3 p-2">
              {tool.name} : {tool.description}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

TailwindPage.auth = true;

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: { session: Session | null } }> {
  const a = await getServerSession(context.req, context.res, authOptions);
  // console.log(1111, a);

  return {
    props: {
      session: JSON.parse(JSON.stringify(a)),
    },
  };
}
