import { createModule, gql } from 'graphql-modules';

export const coreModule = createModule({
  id: 'core',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Query {
        hello: String!
      }
    `,
  ],
  resolvers: {
    Query: {
      hello: () => 'world',
    },
  },
});
