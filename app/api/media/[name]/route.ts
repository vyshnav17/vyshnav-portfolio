import { getMongoDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getWorkersEnv(): Promise<any> {
  try {
    const mod = await import(/* webpackIgnore: true */ "cloudflare:workers");
    return mod.env;
  } catch {
    return undefined;
  }
}

type Props = { params: Promise<{ name: string }> };

export async function GET(req: Request, { params }: Props) {
  const { name } = await params;

  // 1. Try Cloudflare Workers R2 if bound
  const env = await getWorkersEnv();
  if (env && env.BUCKET) {
    const object = await env.BUCKET.get(name);
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers as any);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(object.body as any, { headers });
    }
  }

  // 2. Fetch from MongoDB Atlas media collection
  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("media").findOne({ name });
      if (doc && doc.data) {
        const buffer = doc.data.buffer || doc.data;
        return new Response(buffer, {
          headers: {
            "Content-Type": doc.contentType || "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }
  } catch (err) {
    console.error("Failed to read media from MongoDB:", err);
  }

  return new Response("Not found", { status: 404 });
}
