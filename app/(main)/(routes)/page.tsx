import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mod-toggle";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/sign-in" />
      <ModeToggle/>
    </div>
  );
}
