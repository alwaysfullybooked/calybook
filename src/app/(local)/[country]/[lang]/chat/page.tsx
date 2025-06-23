import ChatInterface from "@/components/client/chat/interface";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ country: string; lang: string }> }) {
  const { country, lang } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/${country}/${lang}/chat`);
  }

  const name = session?.user?.name ?? "Guest";

  return <ChatInterface country={country} email={session.user.email} name={name} />;
}
