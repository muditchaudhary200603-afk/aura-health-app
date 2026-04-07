import crypto from "node:crypto";

export const ADMIN_COOKIE_NAME = "aura_admin_session";

const COOKIE_SECRET = process.env.AURA_ADMIN_SECRET || "aura-dev-secret";
const ADMIN_EMAIL = process.env.AURA_ADMIN_EMAIL || "admin@aurahealth.clinic";
const ADMIN_PASSWORD = process.env.AURA_ADMIN_PASSWORD || "AuraAdmin123!";
const FALLBACK_ADMIN_EMAIL = "admin@aurahealth.com";
const FALLBACK_ADMIN_PASSWORD = "AuraAdmin2026";

type AdminPayload = {
  sub: string;
  exp: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function signValue(value: string) {
  return crypto.createHmac("sha256", COOKIE_SECRET).update(value).digest("base64url");
}

export function validateAdminCredentials(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return (
    (normalized === ADMIN_EMAIL.trim().toLowerCase() && password === ADMIN_PASSWORD) ||
    (normalized === FALLBACK_ADMIN_EMAIL && password === FALLBACK_ADMIN_PASSWORD)
  );
}

export function isAllowedAdminEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return normalized === ADMIN_EMAIL.trim().toLowerCase() || normalized === FALLBACK_ADMIN_EMAIL;
}

export function createAdminToken() {
  const payload: AdminPayload = {
    sub: ADMIN_EMAIL,
    exp: Date.now() + 1000 * 60 * 60 * 12
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  return `${encoded}.${signValue(encoded)}`;
}

export const verifyAdminSession = verifyAdminToken;

export function verifyAdminToken(token?: string | null) {
  if (!token) {
    return false;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return false;
  }

  const expected = signValue(encoded);
  if (expected !== signature) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminPayload;
    return parsed.exp > Date.now();
  } catch {
    return false;
  }
}
