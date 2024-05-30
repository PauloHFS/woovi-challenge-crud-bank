import { Schema, Types, model } from 'mongoose';

export interface UserSchema {
  _id: Types.ObjectId;
  first_name: string;
  tax_id: string;
  hashed_password: string;
}

const userSchema = new Schema<UserSchema>(
  {
    first_name: { type: String, required: true },
    tax_id: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const UserRef = 'User';
export const User = model<UserSchema>(UserRef, userSchema);
