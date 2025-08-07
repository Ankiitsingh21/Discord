import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in"); // SERVER-SIDE REDIRECT
  }

  let profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  // Create new profile if none exists
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    },
  });

  return newProfile;
};
