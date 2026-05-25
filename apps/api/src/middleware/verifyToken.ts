import { authAdmin } from "../config/firebaseAdmin";

export const verifyFirebaseToken = async (token: string) => {
  try {
    const decoded = await authAdmin.verifyIdToken(token);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
