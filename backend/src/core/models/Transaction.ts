import { UserRef } from "@/auth/models/User";
import { Schema, Types, model } from "mongoose";

export interface TransactionSchema {
  _id: Types.ObjectId;
  transaction_id: string;
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  value: number;
}

export const transactionSchema = new Schema<TransactionSchema>(
  {
    transaction_id: {
      type: String,
      required: true,
    },
    sender_id: { type: Schema.Types.ObjectId, required: true, ref: UserRef },
    receiver_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: UserRef,
    },
    value: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const TransactionRef = "Transaction";
export const Transaction = model<TransactionSchema>(
  TransactionRef,
  transactionSchema,
);
