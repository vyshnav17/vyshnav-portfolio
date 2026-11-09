import { headers } from "next/headers";
import { verifyAdminSession } from "./auth";

const ownerEmail = "v17vyshnavtv@gmail.com";

export function isOwner(
  headers: Headers | Awaited<ReturnType<typeof import("next/headers").headers>>
) {
  // 1. Check signed password session cookie
  const cookie = headers.get("cookie") || "";
  if (verifyAdminSession(cookie)) {
    return true;
  }

  // 2. OpenAI Sites authenticated owner header
  const id = headers.get("oai-authenticated-user-id");
  const email = headers.get("oai-authenticated-user-email")?.toLowerCase();
  if (
    id &&
    (email === ownerEmail ||
      (import.meta.env?.DEV &&
        id === "local_seedy" &&
        email === "seedy@sites.test"))
  ) {
    return true;
  }

  // 3. Optional bearer authorization
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
    return Response.json(
      { error: "Unauthorized. Please log in with the admin password." },
      { status: 401 }
    );
  }

  const origin = req.headers.get("origin");
  if (
    origin &&
    (origin !== new URL(req.url).origin ||
      req.headers.get("sec-fetch-site") === "cross-site")
  ) {
    return Response.json(
      { error: "Publish from the admin page on this site." },
      { status: 403 }
    );
  }

  return null;
}
