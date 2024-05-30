import * as argon2 from 'argon2';
import { User } from './models/User';

export const createNewUser = async ({
  first_name,
  tax_id,
  password,
}: {
  first_name: string;
  tax_id: string;
  password: string;
}) => {
  try {
    const hashed_password = await argon2.hash(password);

    const user = new User({
      first_name,
      tax_id,
      hashed_password,
    });

    await user.save();

    return { user };
  } catch (error) {
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
      }
    );
    return { result };
  } catch (error) {
    return { error };
  }
};
