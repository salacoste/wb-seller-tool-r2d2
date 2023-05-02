import { ICompanyData } from './types';
import { randomUUID } from 'crypto';

export const rUID = randomUUID();
export const rUID2 = randomUUID();

const saltRounds = 10;
const hashPassword = async (password: string) => {};

export const seedCompanyData: ICompanyData[] = [
  {
    id: rUID,
    name: 'Та самая богатая компания',
    description: 'Описание самой богатой компании',
    WILDAUTHNEWV3: 'Akskskdkdksk',
    BasketUID: 'sd',
    WBTOKEN: 'grgr',
    XSupplierId: 'asdsa',
    XSupplierIdExternal: 'totoror',
    WB_TOKEN: 'asd223qgqk',
  },
  {
    id: rUID2,
    name: 'Тестовая компания не очень богатая',
    description: 'Описание тестовой не очень богатой компании',
    WILDAUTHNEWV3: 'ldlfl1',
    BasketUID: 'glgl-3dkd',
    WBTOKEN: 'qoodos',
    XSupplierId: 'asoqwlfm',
    XSupplierIdExternal: 'rowoqwe',
    WB_TOKEN: 'qosoc11oaoco',
  },
];
