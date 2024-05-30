import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

export const createJWTToken = async (payload: any) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1 day',
    });
    return { token };
  } catch (error) {
    return { error };
  }
};

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
