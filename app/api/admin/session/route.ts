import { NextResponse } from "next/server";

import { createAdminToken, isAllowedAdminEmail, validateAdminCredentials } from "../../../../lib/auth";
import { createServerSupabase } from "../../../../lib/supabase";

type LoginPayload = {
  email?: string;
  password?: string;
  accessToken?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginPayload;
  const email = body.email?.trim() || "";
  const password = body.password || "";
  const accessToken = body.accessToken?.trim() || "";

  let authenticated = validateAdminCredentials(email, password);

  if (!authenticated && accessToken) {
    const supabase = createServerSupabase();
    const { data, error } = supabase ? await supabase.auth.getUser(accessToken) : { data: { user: null }, error: null };
    const googleEmail = data.user?.email ?? "";

    if (!error && googleEmail && isAllowedAdminEmail(googleEmail)) {
      authenticated = true;
    }
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "aura_admin_session",
    value: createAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "aura_admin_session",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
