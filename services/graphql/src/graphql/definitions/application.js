const gql = require('graphql-tag');

module.exports = gql`

extend type Mutation {
  createApplication(input: CreateApplicationMutationInput!): Application! @requiresOrgRole(roles: [Owner, Administrator])
  setApplicationName(input: SetApplicationNameMutationInput!): Application! @requiresAppRole(roles: [Owner, Administrator])
}

type Application {
  id: String!
  name: String!
  description: String
}

input CreateApplicationMutationInput {
  name: String!
  description: String
}

input SetApplicationNameMutationInput {
  value: String!
}

`;