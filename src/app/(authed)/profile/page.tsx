import { ContactPreferencesForm } from "@/components/client/profile/preferences/contact-form";
import { TennisPreferencesForm } from "@/components/client/profile/preferences/tennis-form";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function SettingsPage() {
  const session = await auth();

  const email = session?.user?.email;
  const contactMethod = session?.user?.contactMethod;
  const contactWhatsAppId = session?.user?.contactWhatsAppId;
  const contactLineId = session?.user?.contactLineId;
  const tennisPreferences = await api.tennisPreferences.find();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-12">
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
        <div>
          <TennisPreferencesForm tennisPreferences={tennisPreferences} />
        </div>
        <div>{email && <ContactPreferencesForm email={email} contactMethod={contactMethod} contactWhatsAppId={contactWhatsAppId} contactLineId={contactLineId} />}</div>
      </div>
    </div>
  );
}
