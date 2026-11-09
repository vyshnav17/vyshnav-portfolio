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
  const env = await getWorkersEnv();

  if (env && env.BUCKET) {
    const object = await env.BUCKET.get(name);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers as any);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body as any, {
      headers,
    });
  }

  return new Response("Not found", { status: 404 });
}
