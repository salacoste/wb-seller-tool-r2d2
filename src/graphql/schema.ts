import { gql } from 'graphql-request';

export const typeDefs = gql`
  type Tool {
    id: String
    name: String
    description: String
    link: String
    image: String
    updatedAt: String
    createdAt: String
  }

  type deleteResult {
    status: String
    message: String
    tool: Tool
  }

  type AuthToken {
    name: String
    id: String
    token: String
    description: String
  }

  type Password {
    id: String
    password: String
    userId: String
    createdAt: String
    updatedAt: String
  }

  type Company {
    id: String
    name: String
    description: String
    users: [User]
    WILDAUTHNEWV3: String
    WBTOKEN: String
    BasketUID: String
    XSupplierId: String
    XSupplierIdExternal: String
    WB_TOKEN: String
    seeded: Boolean
    createdAt: String
    updatedAt: String
  }

  type User {
    id: String
    name: String
    email: String
    emailVerified: String
    image: String
    company: Company!
    companyId: String
    accounts: [String]
    sessions: [String]
    password: Password!
    role: Role!
    roleId: String
    createdAt: String
    updatedAt: String
  }

  type Role {
    id: String
    name: String
    description: String
    users: [User]
    createdAt: String
    updatedAt: String
  }

  type Account {
    id: String
    userId: String
    provider: String
    type: String
    providerAccountId: String
    user: User
  }

  type Query {
    getTools: [Tool!]!
    getId: String
    getTool(id: String!): Tool
    getAuthToken(token: String): AuthToken
    getAuthTokens: [AuthToken!]!
    getUsers: [User]!
    getUser(id: String): User
    getUserByEmail(email: String!): User
  }

  type Mutation {
    addTool(
      name: String!
      link: String!
      description: String!
      image: String!
    ): Tool
    deleteTool(id: String!): deleteResult!
    updateTool(
      id: String!
      name: String
      link: String
      description: String
    ): Tool
    createUser(
      name: String!
      email: String!
      password: String!
      image: String
    ): User
  }
`;
