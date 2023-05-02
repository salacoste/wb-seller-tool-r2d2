export declare interface Tool {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string | null;
}

export declare interface IAuthToken {
  id: number;
  name: string;
  description?: string;
  token: string;
}

export declare interface IUserData {
  id: string;
  email: string;
  name: string;
  image?: string;
  roleId: string;
  companyId: string;
}

export declare interface ICompanyData {
  id: string;
  name: string;
  description: string;
  WILDAUTHNEWV3: string;
  WBTOKEN: string;
  BasketUID: string;
  XSupplierId: string;
  XSupplierIdExternal: string;
  WB_TOKEN: string;
  seeded: boolean;
}

export declare interface IUserPassword {
  id: string;
  password: string;
  userId: string;
}

export declare interface IRole {
  id: string;
  name: string;
  description?: string;
  createdAt?: String;
  updatedAt?: String;
}
