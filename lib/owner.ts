import {headers} from "next/headers";

const ownerEmail = "v17vyshnavtv@gmail.com";

export function isOwner(headers: Headers | Awaited<ReturnType<typeof import("next/headers").headers>>) {
  const id = headers.get("oai-authenticated-user-id");
  const email = headers.get("oai-authenticated-user-email")?.toLowerCase();

  // OpenAI Sites authenticated owner
  if (id && (email === ownerEmail || (import.meta.env.DEV && id === "local_seedy" && email === "seedy@sites.test"))) {
    return true;
  }

  // Cookie-based local/admin session
  const cookie = headers.get("cookie") || "";
  if (
    cookie.includes("__sites_local_auth=1") ||
    cookie.includes("admin_session=1") ||
    cookie.includes("admin_authenticated=1")
  ) {
    return true;
  }

  // Optional bearer authorization
  const authHeader = headers.get("authorization");
  if (authHeader && authHeader === "Bearer vyshnav-admin-secret") {
    return true;
  }

  return false;
}

export async function ownerRequest() {
  return isOwner(await headers());
}

export function checkMutation(req: Request) {
  if (!isOwner(req.headers)) {
    return Response.json({ error: "Sign in with the portfolio owner account." }, { status: 403 });
  }

  const origin = req.headers.get("origin");
  if (origin && (origin !== new URL(req.url).origin || req.headers.get("sec-fetch-site") === "cross-site")) {
    return Response.json({ error: "Publish from the admin page on this site." }, { status: 403 });
  }

  return null;
}
