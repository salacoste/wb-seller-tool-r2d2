import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import {
  SignInResponse,
  getProviders,
  signIn,
  useSession,
} from 'next-auth/react';

import { getCsrfToken } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';

const errorDictionary: { [k: string]: string } = {
  CredentialsSignin: 'Неправильный логин или пароль',
};

export const SignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signInStatus, setSignInStatus] = useState<any>();

  // const error = useRouter().query.error;
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl;

  if (error && typeof error !== 'string') {
    console.log('error from query string  is not a string');
    return false;
  }
  useEffect(() => {
    if (session) {
      typeof callbackUrl === 'string' && router.push(callbackUrl);

      router.push('/example_protected_page');
    }
  }, []);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const a: any = await signIn('credentials', {
      redirect: false,
      password,
      email,
    });

    console.log('aaa', a);

    setSignInStatus(a);

    if (a?.ok) {
      if (typeof callbackUrl === 'string') {
        router.push(callbackUrl);
      } else {
        router.push('example_protected_page');
      }
    }
    if (a?.error) {
      setError(a.error);
    }
  };
  return (
    // <div className="flex justify-center flex-col items-center h-screen card">
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src={'/wildberries.png'}
          alt="Logo"
          width={120}
          height={30}
          className="block m-auto"
        />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Авторизация
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={onSubmit}
          action="/api/auth/callback/credentials"
          method="post"
        >
          <div>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white"
            >
              Электронная почта
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {error && (
            <div className="form-control mt-2 mb-2 text-red-600 font-light italic">
              <span>
                {errorDictionary[error] ||
                  (error && !signInStatus?.ok) ||
                  (signInStatus?.status === 'error' && signInStatus.message)}
              </span>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Войти
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Нет аккаунта?{' '}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Читай инструкцию как создать аккаунт
          </a>
        </p>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // console.log('ccc', context);
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default SignIn;
