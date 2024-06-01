import { Account } from "@/core/models/Account";
import * as argon2 from "argon2";
import mongoose from "mongoose";
import { User } from "./models/User";

export const createNewUser = async ({
  first_name,
  tax_id,
  password,
}: {
  first_name: string;
  tax_id: string;
  password: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const hashed_password = await argon2.hash(password);

    const user = new User({
      first_name,
      tax_id,
      hashed_password,
    });
    const account = new Account({
      account_number: user.id, // TODO find a better way to gen this number
      user_id: user.id,
    });

    await user.save();
    await account.save();

    await session.commitTransaction();
    await session.endSession();

    return { user, account };
  } catch (error) {
    await session.endSession();
    await session.endSession();
    return { error };
  }
};

export const getUserByTaxId = async (tax_id: string) => {
  try {
    const user = await User.findOne({
      tax_id,
    });

    return { user };
  } catch (error) {
    return { error };
  }
};

export const updateUserHashedPassword = async ({
  tax_id,
  hashed_password,
}: {
  tax_id: string;
  hashed_password: string;
}) => {
  try {
    const result = await User.updateOne(
      {
        tax_id,
      },
      {
        hashed_password,
      },
    );
    return { result };
  } catch (error) {
    return { error };
  }
};
