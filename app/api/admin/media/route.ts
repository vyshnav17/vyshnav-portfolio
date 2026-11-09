import { checkMutation } from "@/lib/owner";

export const dynamic = "force-dynamic";

async function getWorkersEnv(): Promise<any> {
  try {
    const mod = await import(/* webpackIgnore: true */ "cloudflare:workers");
    return mod.env;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  const authError = checkMutation(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueName = `${Date.now()}-${cleanName}`;
    const buffer = await file.arrayBuffer();

    // 1. If Cloudflare R2 BUCKET is bound
    const env = await getWorkersEnv();
    if (env && env.BUCKET) {
      await env.BUCKET.put(uniqueName, buffer, {
        httpMetadata: {
          contentType: file.type || "application/octet-stream",
        },
      });
      return Response.json({ url: `/api/media/${uniqueName}` });
    }

    // 2. If running locally on Node
    if (typeof process !== "undefined" && process.release?.name === "node") {
      try {
        const fs = await import("node:fs/promises");
        const path = await import("node:path");
        const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });
        const filePath = path.resolve(uploadsDir, uniqueName);
        await fs.writeFile(filePath, Buffer.from(buffer));
        return Response.json({ url: `/uploads/${uniqueName}` });
      } catch (err) {
        console.error("Local file write error:", err);
      }
    }

    // Fallback: return data URL for immediate preview if storage is not configured
    const base64 = Buffer.from(buffer).toString("base64");
    const mime = file.type || "image/png";
    return Response.json({ url: `data:${mime};base64,${base64}` });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}
