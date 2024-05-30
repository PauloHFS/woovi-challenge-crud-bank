import * as argon2 from 'argon2';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { User } from './models/User';

interface JWTPayload {
  _id: string;
  first_name: string;
  tax_id: string;
}

export const createJWTToken = async (payload: JWTPayload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1 day',
    });
    return { token };
  } catch (error) {
    return { error };
  }
};

export async function getUserByJWTToken(request: IncomingMessage) {
  if (request.headers.authorization) {
    const token = request.headers.authorization.split(' ')[1];
    const tokenPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    const user = await User.findOne(
      {
        _id: tokenPayload._id,
      },
      {
        _id: 1,
        first_name: 1,
        tax_id: 1,
      }
    );

    return user;
  }

  return null;
}

export const checkPassword = async (
  hashed_password: string,
  unchecked_password: string
) => {
  try {
    const isOk = await argon2.verify(hashed_password, unchecked_password);
    if (isOk) {
      const needsRehash = argon2.needsRehash(hashed_password);

      if (needsRehash) {
        const new_hash = await argon2.hash(unchecked_password);

        return { isOk, new_hash };
      }
    }
    return { isOk };
  } catch (error) {
    return { error };
  }
};
