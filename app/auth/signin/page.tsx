import { AuthSigninClient } from "@/components/auth-signin-client";

export default function SigninPage({
  searchParams
}: {
  searchParams?: { code?: string };
}) {
  return <AuthSigninClient code={searchParams?.code} />;
}
