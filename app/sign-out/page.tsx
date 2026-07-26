import { signOutUser } from "@/features/auth/actions";

export const dynamic = "force-dynamic";

export default async function SignOutPage() {
  await signOutUser();
}