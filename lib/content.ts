import {cache} from "react";
import initial from "@/data/initial.json";
import {type Content, validateDocument} from "@/data/schema";

async function getWorkersEnv(): Promise<any> {
  try {
    const mod = await import(/* webpackIgnore: true */ "cloudflare:workers");
    return mod.env;
  } catch {
    return undefined;
  }
}

// Optional Vercel KV / Upstash Redis persistence (no external dependencies, pure fetch)
async function getVercelKV(): Promise<{ version: number; content: Content } | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/portfolio_doc`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as any;
    if (!json.result) return null;
    const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
    return {
      version: parsed.version || 1,
      content: (parsed.content || parsed) as Content,
    };
  } catch {
    return null;
  }
}

async function setVercelKV(version: number, content: Content): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/set/portfolio_doc`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.stringify({ version, content })),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const readPortfolio = cache(async () => {
  // 1. Try Vercel KV / Upstash if configured on Vercel
  const kvData = await getVercelKV();
  if (kvData) return kvData;

  // 2. Try Cloudflare Workers D1 if running on Cloudflare
  try {
    const env = await getWorkersEnv();
    if (env && env.DB) {
      const record = (await env.DB.prepare(
        "SELECT version, document FROM portfolio WHERE id=1"
      ).first()) as { version: number; document: string } | null;
      if (record) {
        return {
          version: record.version,
          content: JSON.parse(record.document) as Content,
        };
      }
    }
  } catch {}

  // 3. Fallback to initial.json
  return { version: 0, content: initial as Content };
});

export async function getContent() {
  return (await readPortfolio()).content;
}

export async function savePortfolio(document: Content) {
  const validated = validateDocument(document);
  const current = await readPortfolio();
  const nextVersion = (current.version || 0) + 1;
  const docString = JSON.stringify(validated);

  // 1. Save to Vercel KV / Upstash if configured
  await setVercelKV(nextVersion, validated);

  // 2. Save to Cloudflare D1 if configured
  try {
    const env = await getWorkersEnv();
    if (env && env.DB) {
      await env.DB.prepare(
        "CREATE TABLE IF NOT EXISTS portfolio (id integer PRIMARY KEY NOT NULL, version integer NOT NULL, document text NOT NULL)"
      ).run();
      await env.DB.prepare(
        "INSERT INTO portfolio (id, version, document) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET version = excluded.version, document = excluded.document"
      ).bind(nextVersion, docString).run();
    }
  } catch (e) {
    console.error("Failed to save to Cloudflare D1:", e);
  }

  // 3. Also persist to data/initial.json if running in local Node environment
  if (typeof process !== "undefined" && process.release?.name === "node") {
    try {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const filePath = path.resolve(process.cwd(), "data", "initial.json");
      await fs.writeFile(filePath, JSON.stringify(validated, null, 2), "utf8");
    } catch {}
  }

  return { version: nextVersion, content: validated };
}

export async function resetPortfolio() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      await fetch(`${url}/del/portfolio_doc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }

  try {
    const env = await getWorkersEnv();
    if (env && env.DB) {
      await env.DB.prepare("DELETE FROM portfolio WHERE id=1").run();
    }
  } catch (e) {
    console.error("Failed to reset in Cloudflare D1:", e);
  }

  return { version: 0, content: initial as Content };
}
