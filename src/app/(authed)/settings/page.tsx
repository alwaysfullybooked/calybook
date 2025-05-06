import { ContactPreferencesForm } from "@/components/client/profile/contact-preferences-form";
import { auth } from "@/server/auth";

export default async function SettingsPage() {
  const session = await auth();

  const email = session?.user?.email;
  const contactMethod = session?.user?.contactMethod;
  const contactWhatsAppId = session?.user?.contactWhatsAppId;
  const contactLineId = session?.user?.contactLineId;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>
        <div className="mx-auto max-w-2xl">{email && <ContactPreferencesForm email={email} contactMethod={contactMethod} contactWhatsAppId={contactWhatsAppId} contactLineId={contactLineId} />}</div>
      </div>
    </main>
  );
}
