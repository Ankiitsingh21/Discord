import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect(`/sign-in`);
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect(`/`);
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      {/* Header */}
      <ChatHeader
        serverId={channel.serverId}
        type={"channel"}
        name={channel.name}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        Future messages
      </div>

      {/* Chat input fixed at bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-[#313338]">
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
