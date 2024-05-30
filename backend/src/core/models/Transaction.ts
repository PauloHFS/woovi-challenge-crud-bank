import { Schema, Types, model } from 'mongoose';
import { AccountRef } from './Account';

interface TransactionSchema {
  _id: Types.ObjectId;
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  value: number;
}

const transactionSchema = new Schema<TransactionSchema>(
  {
    sender_id: { type: Schema.Types.ObjectId, required: true, ref: AccountRef },
    receiver_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: AccountRef,
    },
    value: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const TransactionRef = 'Transaction';
export const Transaction = model<TransactionSchema>(
  TransactionRef,
  transactionSchema
);
