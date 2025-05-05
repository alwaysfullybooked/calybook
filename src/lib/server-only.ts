"server only";

import { auth } from "@/server/auth";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";

export async function getCustomerHash() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const email = session.user.email;
  const { hashWithSignature } = await alwaysbookbooked.integrations.generateHash(email);

  console.log(hashWithSignature);

  return hashWithSignature.split(":")[0];
}
