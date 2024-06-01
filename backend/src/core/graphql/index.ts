import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  createTransaction,
  getAccounts,
  getTransactionById,
  getTransactions,
} from '../services';
import * as typeDefs from './schema.graphql';

const resolvers = {
  Query: {
    accounts: async (_root: any, args: any, ctx: any) => {
      if (!ctx.user) {
        return {
          error: 'Not authorized',
        };
      }

      const { accounts, error } = await getAccounts();

      if (error || !accounts) {
        return {
          error: error ?? 'WTF',
        };
      }

      return {
        data: accounts,
      };
    },
    transaction: async (_root: any, args: any, ctx: any) => {
      if (!ctx.user) {
        return {
          error: 'Not authorized',
        };
      }

      const { transaction, error } = await getTransactionById({
        transaction_id: args?.transaction_id,
        user_id: ctx.user._id,
      });

      if (error || !transaction) {
        return {
          error: error ?? 'Transação não encontrada',
        };
      }

      return {
        transaction_id: transaction.transaction_id,
        sender_id: transaction.sender_id,
        receiver_id: transaction.receiver_id,
        value: transaction.value,
      };
    },
    transactions: async (_root: any, args: any, ctx: any) => {
      if (!ctx.user) {
        return {
          error: 'Not authorized',
        };
      }

      const { transactions, error } = await getTransactions(ctx.user._id);

      if (error || !transactions) {
        //TODO fix the return type to not be necessary this
        return {
          error: error ?? 'WTF',
        };
      }

      // TODO
      return {
        data: transactions,
      };
    },
  },
  Mutation: {
    create_transaction: async (_root: any, args: any, ctx: any) => {
      if (!ctx.user) {
        return {
          error: 'Not authorized',
        };
      }

      const { registers, error } = await createTransaction({
        transaction_id: args.data.transaction_id,
        sender_id: ctx?.user?._id?.toString(),
        receiver_id: args.data.receiver_id,
        value: args.data.value,
      });

      if (error || !registers) {
        //TODO fix the return type to not be necessary this
        return {
          error: error ?? 'WTF',
        };
      }

      const register = registers.find(
        v => v.sender_id == ctx?.user?._id?.toString()
      );

      return {
        _id: register?._id.toString(),
      };
    },
  },
};

export const CoreSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
