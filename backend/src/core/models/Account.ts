import { UserRef } from '@/auth/models/User';
import { Schema, Types, model } from 'mongoose';

export interface AccountSchema {
  _id: Types.ObjectId;
  account_number: string;
  user_id: Types.ObjectId;
  balance: number;
}

const accountSchema = new Schema<AccountSchema>(
  {
    account_number: {
      type: String,
      unique: true,
      auto: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: UserRef,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AccountRef = 'Account';
export const Account = model<AccountSchema>(AccountRef, accountSchema);
