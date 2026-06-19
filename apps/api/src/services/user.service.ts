import { DecodedIdToken } from "firebase-admin/auth";
import { prisma } from "../config/prisma";

export const syncUser = async (decoded: DecodedIdToken) => {
  const { uid, email } = decoded;

  if (!email) throw new Error("Email is missing from token");

  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: uid,
        email: email || "",
      },
    });
  }
  return user;
};
