import { UserRef } from '@/auth/models/User';
import { Schema, Types, model } from 'mongoose';
import { TransactionRef } from './Transaction';

export interface AccountSchema {
  _id: Types.ObjectId;
  account_number: string;
  user_id: Types.ObjectId;
  // TODO validate if this implementation is correct
  ledger: Array<{
    transaction_id: Types.ObjectId;
    debit: number;
    credit: number;
    balance: number;
  }>;
}

const accountSchema = new Schema<AccountSchema>(
  {
    account_number: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: UserRef },
    ledger: [
      {
        transaction_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: TransactionRef,
        },
        debit: { type: Number, required: true },
        credit: { type: Number, required: true },
        balance: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AccountRef = 'Account';
export const Account = model<AccountSchema>(AccountRef, accountSchema);
