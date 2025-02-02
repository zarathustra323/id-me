const GraphQLJSON = require('graphql-type-json');
const deepAssign = require('deep-assign');

const accessLevel = require('./access-level');
const appUser = require('./app-user');
const application = require('./application');
const locale = require('./locale');
const organization = require('./organization');
const team = require('./team');
const user = require('./user');
const { DateType, ObjectIDType } = require('../types');

module.exports = deepAssign(
  accessLevel,
  appUser,
  application,
  locale,
  organization,
  team,
  user,
  {
    /**
     * Custom scalar types.
     */
    Date: DateType,
    ObjectID: ObjectIDType,
    JSON: GraphQLJSON,

    /**
     * Root queries.
     */
    Query: {
      /**
       *
       */
      ping: () => 'pong',
    },

    /**
     * Root mutations.
     */
    Mutation: {
      /**
       *
       */
      ping: () => 'pong',
    },
  },
);
