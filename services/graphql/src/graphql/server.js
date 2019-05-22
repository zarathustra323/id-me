const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = ({ app, path }) => {
  const server = new ApolloServer({
    schema,
    tracing: isProduction,
    cacheControl: isProduction,
    introspection: !isProduction,
    debug: !isProduction,
    playground: !isProduction ? { endpoint: path } : false,
  });
  server.applyMiddleware({ app, path });
};
