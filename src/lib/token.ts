import * as jwt from "jsonwebtoken";
import { TokenUser, User } from "../modules/user/schema";

const tokenSecretKey = process.env.TOKEN_SECRET_KEY;

export function signToken(user: TokenUser) {
  try {
    const payload = { id: user.id };

    if (!tokenSecretKey) {
      throw new Error("Failed to sign token. Token secret key is not setup.");
    }

    const token = jwt.sign(payload, tokenSecretKey, { expiresIn: "7d" });

    return token;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to sign token: ${error}`);
  }
}

export function verifyToken(token: string) {
  try {
    if (!tokenSecretKey) {
      throw new Error("Failed to verify token. Token secret key is not setup.");
    }

    const decodedToken = jwt.verify(token, tokenSecretKey);

    return decodedToken;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to verify token: ${error}`);
  }
}
