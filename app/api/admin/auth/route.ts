import {
  getAdminPassword,
  createAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/auth";
import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return Response.json({
    authenticated: isOwner(req.headers),
  });
}

export async function POST(req: Request) {
  try {
    const body = ((await req.json().catch(() => ({}))) || {}) as {
      action?: string;
      password?: string;
    };
    const action = body.action || "login";

    if (action === "logout" || action === "signout") {
      const headers = new Headers();
      headers.append("Set-Cookie", clearAdminSessionCookie());
      headers.append(
        "Set-Cookie",
        "admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
      );
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers,
      });
    }

    // Login with password
    const entered = (body.password || "").trim();
    const expected = getAdminPassword().trim();

    if (!entered) {
      return Response.json(
        { error: "Please enter the admin password." },
        { status: 400 }
      );
    }

    if (entered !== expected) {
      return Response.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const headers = new Headers();
    headers.append("Set-Cookie", createAdminSessionCookie());
    headers.append(
      "Set-Cookie",
      "admin_session=1; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax"
    );

    return new Response(
      JSON.stringify({ authenticated: true, message: "Login successful" }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Authentication error" },
      { status: 500 }
    );
  }
}
