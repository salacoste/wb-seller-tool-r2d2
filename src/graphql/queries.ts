import { gql } from '@apollo/client';

export const getAllTools = gql`
  query GetTools {
    getTools {
      id
      createdAt
      description
      image
      link
      name
      updatedAt
    }
  }
`;

export const getUsers = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      accounts
      sessions
      password {
        password
        id
        userId
        createdAt
        updatedAt
      }
      company {
        id
        name
        description
        WILDAUTHNEWV3
        WBTOKEN
        BasketUID
        XSupplierId
        XSupplierIdExternal
        WB_TOKEN
        seeded
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const getUser = gql`
  query GetUser($id: String) {
    getUser(id: $id) {
      id
      name
      email
      accounts
      sessions
      password {
        password
        id
        userId
        createdAt
        updatedAt
      }
      company {
        id
        name
        description
        WILDAUTHNEWV3
        WBTOKEN
        BasketUID
        XSupplierId
        XSupplierIdExternal
        WB_TOKEN
        seeded
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const getUserByEmail = gql`
  query GetUsers($email: String!) {
    getUserByEmail(email: $email) {
      id
      name
      email
      emailVerified
      image
      company {
        id
        name
        description
        WILDAUTHNEWV3
        WBTOKEN
        BasketUID
        XSupplierId
        XSupplierIdExternal
        WB_TOKEN
        seeded
        createdAt
        updatedAt
      }
      companyId
      password {
        password
        userId
        createdAt
        updatedAt
      }
      role {
        id
        name
        description
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
