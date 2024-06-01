import mongoose from "mongoose";
import { Account } from "./models/Account";
import { Transaction } from "./models/Transaction";

export const getAccounts = async () => {
  try {
    const accounts = await Account.find({});
    return { accounts };
  } catch (error) {
    return { error };
  }
};

export const getTransactions = async (user_id: string) => {
  try {
    const transactions = await Transaction.find({
      receiver_id: user_id,
    });

    return { transactions };
  } catch (error) {
    return { error };
  }
};

export const createTransaction = async ({
  transaction_id,
  sender_id,
  receiver_id,
  value,
}: {
  transaction_id: string;
  sender_id: string;
  receiver_id: string;
  value: number;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transaction = await Transaction.findOne({
      transaction_id,
      sender_id,
      receiver_id,
      value,
    });

    if (transaction) {
      await session.abortTransaction();
      await session.endSession();

      return {
        registers: [transaction],
      };
    }

    const senderAccount = await Account.findOne({
      user_id: sender_id,
    });
    const receiverAccount = await Account.findOne({
      user_id: receiver_id,
    });

    if (!senderAccount || !receiverAccount) {
      await session.abortTransaction();
      await session.endSession();

      return {
        error: `${
          !senderAccount ? "Sender Account" : "Receiver Account"
        } not found`,
      };
    }

    const registers = await Transaction.insertMany([
      // Register the credit in the receiver
      {
        transaction_id,
        sender_id,
        receiver_id,
        value,
      },
      // Register the debit in the sender
      {
        transaction_id,
        sender_id: receiver_id,
        receiver_id: sender_id,
        value: -1 * value,
      },
    ]);

    senderAccount.balance -= value;
    receiverAccount.balance += value;

    await senderAccount.save();
    await receiverAccount.save();

    await session.commitTransaction();
    await session.endSession();
    return { registers };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return { error };
  }
};

export const getTransactionById = async ({
  transaction_id,
  user_id,
}: {
  transaction_id: string;
  user_id: string;
}) => {
  try {
    const transaction = await Transaction.findOne({
      transaction_id,
      receiver_id: user_id,
    });

    return { transaction };
  } catch (error) {
    return { error };
  }
};
