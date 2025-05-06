import { ContactPreferencesForm } from "@/components/client/profile/contact-preferences-form";
import { auth } from "@/server/auth";

export default async function SettingsPage() {
  const session = await auth();

  const email = session?.user?.email;
  const contactMethod = session?.user?.contactMethod;
  const contactWhatsAppId = session?.user?.contactWhatsAppId;
  const contactLineId = session?.user?.contactLineId;

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <div>{email && <ContactPreferencesForm email={email} contactMethod={contactMethod} contactWhatsAppId={contactWhatsAppId} contactLineId={contactLineId} />}</div>
    </div>
  );
}
