import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { AccountRef } from '../models/Account';

export const LedgerType = new GraphQLObjectType({
  name: 'Ledger',
  fields: {
    transaction_id: { type: GraphQLString },
    debit: { type: GraphQLString },
    credit: { type: GraphQLString },
    balance: { type: GraphQLString },
  },
});

export const AccountType = new GraphQLObjectType({
  name: AccountRef,
  fields: {
    _id: { type: GraphQLString },
    account_number: { type: GraphQLString },
    user_id: { type: GraphQLString },
    ledger: { type: new GraphQLList(LedgerType) },
  },
});

export const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: {
    _id: { type: GraphQLString },
    sender_id: { type: GraphQLString },
    receiver_id: { type: GraphQLString },
    value: { type: GraphQLString },
  },
});
