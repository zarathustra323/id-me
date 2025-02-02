import gql from 'graphql-tag';

export default gql`
  fragment AppUserListFragment on AppUser {
    id
    email
    domain
    givenName
    familyName
    accessLevels {
      id
      name
    }
    teams {
      id
      name
    }
  }
`;
