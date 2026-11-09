import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return Response.json({
    authenticated: isOwner(req.headers),
  });
}

export async function POST(req: Request) {
  try {
    const body = ((await req.json().catch(() => ({}))) || {}) as { action?: string; passkey?: string };
    const action = body.action || "signin";

    if (action === "signout") {
      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        "admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
      );
      headers.append(
        "Set-Cookie",
        "__sites_local_auth=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
      );
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers,
      });
    }

    // Sign in
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      "admin_session=1; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax"
    );
    headers.append(
      "Set-Cookie",
      "__sites_local_auth=1; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax"
    );

    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Auth error" }, { status: 400 });
  }
}
