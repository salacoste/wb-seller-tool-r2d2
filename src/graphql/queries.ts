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
