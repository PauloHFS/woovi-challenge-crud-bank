import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { UserRef } from '../models/User';

export const UserType = new GraphQLObjectType({
  name: UserRef,
  fields: {
    _id: { type: GraphQLInt },
    first_name: { type: GraphQLString },
    tax_id: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});
