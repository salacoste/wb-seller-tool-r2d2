import { useForm } from 'react-hook-form';
import {
  PhotoIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';

export const WbCredsForm = () => {
  const schema = yup
    .object({
      WILDAUTHNEWV3: yup.string().required().min(10).max(100),
      WBTOKEN: yup.string().required().min(10).max(100),
      BasketUID: yup.string().required().max(100),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = (data: any) => console.log(data);
  console.log(watch('WILDAUTHNEWV3')); // watch input value by passing the name of it

  useEffect(() => {
    console.log(console.log(errors));
  }, [errors]);

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className=" text-white bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-6 sm:px-4 py-4">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Ключи авторизации Wildberries
          </h2>
          <p className="mt-2 italic text-sm leading-6 text-gray-600">
            Для начала работы приложения необходимо ввести ключи авторизации
            Wildberries, включая API статистика и данные из cookies. Смотрите
            инструкции под каждым полем в форме.
          </p>
        </div>

        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="WILDAUTHNEWV3"
                  className="block text-sm font-medium leading-6 text-gray-900 relative"
                >
                  WILDAUTHNEWV3
                  <div className="inline-block relative group">
                    <QuestionMarkCircleIcon
                      className="h-4 w-4 text-blue-600 hover:cursor-pointer ml-2 inline-block align-middle "
                      aria-hidden="true"
                    />
                    <div className="absolute w-36 min-h-fit rounded-lg font-normal pt-2 border-slate-500 ring-1 ring-gray-900/5 p-4 text-xs -bottom-6 left-6 bg-slate-200 shadow-sm group-hover:visible  invisible transition-all ease-in-out">
                      {`Берется на сайте wildberries.ru в cookie (правой кнопкой, показать панель разработчика -> Application -> Cookies)`}
                    </div>
                  </div>
                </label>

                <div className="mt-2">
                  <input
                    type="text"
                    // name="first-name"
                    id="WILDAUTHNEWV3"
                    autoComplete="WILDAUTHNEWV3"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('WILDAUTHNEWV3', {
                      required: true,
                      maxLength: 80,
                      minLength: 10,
                    })}
                  />
                  {errors.WILDAUTHNEWV3?.message && (
                    <span className="text-sm italic text-red-700 mt-1">
                      {`${errors.WILDAUTHNEWV3?.message}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="WBTOKEN"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  WBTOKEN
                  <div className="inline-block relative group">
                    <QuestionMarkCircleIcon
                      className="h-4 w-4 text-blue-600 hover:cursor-pointer ml-2 inline-block align-middle "
                      aria-hidden="true"
                    />
                    <div className="absolute w-36 min-h-fit rounded-lg font-normal pt-2 border-slate-500 ring-1 ring-gray-900/5 p-4 text-xs -bottom-6 left-6 bg-slate-200 shadow-sm group-hover:visible  invisible transition-all ease-in-out">
                      {`Берется на сайте wildberries.ru в cookie (правой кнопкой, показать панель разработчика -> Application -> Cookies)`}
                    </div>
                  </div>
                </label>

                <div className="mt-2">
                  <input
                    type="text"
                    // name="WBTOKEN"
                    id="WBTOKEN"
                    autoComplete="WBTOKEN"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('WBTOKEN')}
                  />
                  {errors.WBTOKEN?.message && (
                    <span className="text-sm italic text-red-700 mt-1">
                      {`${errors.WBTOKEN?.message}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="BasketUID"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  BasketUID
                  <div className="inline-block relative group">
                    <QuestionMarkCircleIcon
                      className="h-4 w-4 text-blue-600 hover:cursor-pointer ml-2 inline-block align-middle "
                      aria-hidden="true"
                    />
                    <div className="absolute w-36 min-h-fit rounded-lg font-normal pt-2 border-slate-500 ring-1 ring-gray-900/5 p-4 text-xs -bottom-6 left-6 bg-slate-200 shadow-sm group-hover:visible  invisible transition-all ease-in-out">
                      {`Берется на сайте wildberries.ru в cookie (правой кнопкой, показать панель разработчика -> Application -> Cookies)`}
                    </div>
                  </div>
                </label>
                <div className="mt-2">
                  <input
                    id="BasketUID"
                    name="BasketUID"
                    type="text"
                    autoComplete="BasketUID"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="XSupplierId"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  X-SupplierId
                  <div className="inline-block relative group">
                    <QuestionMarkCircleIcon
                      className="h-4 w-4 text-blue-600 hover:cursor-pointer ml-2 inline-block align-middle "
                      aria-hidden="true"
                    />
                    <div className="absolute w-36 min-h-fit rounded-lg font-normal pt-2 border-slate-500 ring-1 ring-gray-900/5 p-4 text-xs -bottom-6 left-6 bg-slate-200 shadow-sm group-hover:visible  invisible transition-all ease-in-out">
                      {`Берется на сайте wildberries.ru в cookie (правой кнопкой, показать панель разработчика -> Application -> Cookies)`}
                    </div>
                  </div>
                </label>
                <div className="mt-2">
                  <input
                    id="XSupplierId"
                    name="XSupplierId"
                    type="text"
                    autoComplete="XSupplierId"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 ">
                <label
                  htmlFor="XSupplierIdExternal"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  X-SupplierId-External
                  <div className="inline-block relative group">
                    <QuestionMarkCircleIcon
                      className="h-4 w-4 text-blue-600 hover:cursor-pointer ml-2 inline-block align-middle "
                      aria-hidden="true"
                    />
                    <div className="absolute w-36 min-h-fit rounded-lg font-normal pt-2 border-slate-500 ring-1 ring-gray-900/5 p-4 text-xs -bottom-6 left-6 bg-slate-200 shadow-sm group-hover:visible  invisible transition-all ease-in-out">
                      {`Берется на сайте wildberries.ru в cookie (правой кнопкой, показать панель разработчика -> Application -> Cookies)`}
                    </div>
                  </div>
                </label>
                <div className="mt-2">
                  <input
                    id="XSupplierIdExternal"
                    name="XSupplierIdExternal"
                    type="text"
                    autoComplete="XSupplierIdExternal"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 pt-3 border-t border-slate-600/20">
                <label
                  htmlFor="WB_TOKEN"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  WB_TOKEN
                  <div className="inline-block relative group">
                    <QuestionMarkCircleIcon
                      className="h-4 w-4 text-blue-600 hover:cursor-pointer ml-2 inline-block align-middle "
                      aria-hidden="true"
                    />
                    <div className="absolute w-36 min-h-fit rounded-lg font-normal pt-2 border-slate-500 ring-1 ring-gray-900/5 p-4 text-xs -bottom-6 left-6 bg-slate-200 shadow-sm group-hover:visible  invisible transition-all ease-in-out">
                      {`Берется на сайте seller.wildberries.ru. Необходимо создать API ключ для получения статистики.`}
                    </div>
                  </div>
                </label>
                <div className="mt-2">
                  <input
                    id="WB_TOKEN"
                    name="WB_TOKEN"
                    type="text"
                    autoComplete="WB_TOKEN"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Notifications
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We'll always let you know about important changes, but you pick what
            else you want to hear about.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="max-w-2xl space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  By Email
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-900"
                      >
                        Comments
                      </label>
                      <p className="text-gray-500">
                        Get notified when someones posts a comment on a posting.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="candidates"
                        className="font-medium text-gray-900"
                      >
                        Candidates
                      </label>
                      <p className="text-gray-500">
                        Get notified when a candidate applies for a job.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-gray-900"
                      >
                        Offers
                      </label>
                      <p className="text-gray-500">
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Push Notifications
                </legend>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  These are delivered via SMS to your mobile phone.
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-everything"
                      name="push-notifications"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-everything"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Everything
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-email"
                      name="push-notifications"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Same as email
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-nothing"
                      name="push-notifications"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-nothing"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      No push notifications
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WbCredsForm;
