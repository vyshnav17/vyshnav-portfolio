import crypto from "node:crypto";

const DEFAULT_DEV_PASSWORD = "admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_DEV_PASSWORD;
}

export function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "vyshnav-portfolio-admin-secret-2026"
  );
}

export function signToken(payload: object): string {
  const secret = getAuthSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifyToken<T = any>(token: string | null | undefined): T | null {
  if (!token || !token.includes(".")) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const secret = getAuthSecret();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) return null;
  const match = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
  if (!match) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload as T;
  } catch {
    return null;
  }
}

export function parseCookies(
  cookieHeader: string | null | undefined
): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const [name, ...val] = part.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(val.join("="));
    }
  }
  return cookies;
}

export function verifyAdminSession(
  cookieHeader: string | null | undefined
): boolean {
  const cookies = parseCookies(cookieHeader);
  const token = cookies["admin_token"];
  if (token) {
    const session = verifyToken<{ admin: boolean; exp: number }>(token);
    if (session && session.admin) return true;
  }

  // Backwards compatibility for dev cookies
  if (
    process.env.NODE_ENV !== "production" &&
    (cookies["admin_session"] === "1" || cookies["__sites_local_auth"] === "1")
  ) {
    return true;
  }

  return false;
}

export function createAdminSessionCookie(): string {
  const token = signToken({
    admin: true,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `admin_token=${token}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax;${secure}`;
}

export function clearAdminSessionCookie(): string {
  return `admin_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax;`;
}

