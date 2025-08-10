import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const { inviteCode } = await params; // ✅ Await because it's a Promise in Next.js 15

  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  // Check if user is already a member of the server
  const existingServer = await db.server.findFirst({
    where: {
      invitationCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // Add the user to the server
  const server = await db.server.update({
    where: {
      invitationCode: inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
