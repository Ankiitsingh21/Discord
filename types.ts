import { Profile, Server, Member } from "./lib/generated/prisma";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
