import { makeExecutableSchema } from '@graphql-tools/schema';
import * as typeDefs from './schema.graphql';

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

export const CoreSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
