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
  const [signInStatus, setSignInStatus] = useState<
    SignInResponse | undefined
  >();

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

    const a: SignInResponse | undefined = await signIn('credentials', {
      redirect: false,
      password,
      email,
    });

    // if (a?.status === 'error') {
    // }

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
    <div className="wrapper flex flex-1 flex-col justify-center min-h-screen  ">
      <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl   flex m-auto flex-col bg-slate-50">
        <div className="card-body">
          <h1 className="font-bold text-3xl text-blue-600">Sign In</h1>
          <form
            className="mt-4"
            onSubmit={onSubmit}
            action="/api/auth/callback/credentials"
            method="post"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text text-md">Email</span>
              </label>
              <input
                type="text"
                placeholder="email"
                name="email"
                className="input input-bordered p-2"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="form-control mt-2 mb-2">
              <label className="label">
                <span className="label-text text-md">Password</span>
              </label>
              <input
                type="password"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Пароль"
                className="input input-bordered p-2"
              />
            </div>

            {error && (
              <div className="form-control mt-2 mb-2 text-red-600 font-light italic">
                <span>
                  {errorDictionary[error] ||
                    (error && !signInStatus?.ok) ||
                    (signInStatus.status === 'error' && signInStatus.message)}
                </span>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="btn-primary btn rounded-lg mt-4 mb-4"
              >
                Войти
              </button>
            </div>
          </form>
        </div>
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
