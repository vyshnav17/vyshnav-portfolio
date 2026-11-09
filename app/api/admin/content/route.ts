import { readPortfolio, savePortfolio } from "@/lib/content";
import { checkMutation, isOwner } from "@/lib/owner";
import { checkMongoConnection } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { version, content } = await readPortfolio();
  const authenticated = isOwner(req.headers);
  const mongoStatus = await checkMongoConnection();

  return Response.json({
    version,
    content,
    authenticated,
    database: mongoStatus,
  });
}

export async function POST(req: Request) {
  const authError = checkMutation(req);
  if (authError) return authError;

  try {
    const body = (await req.json()) as any;
    const result = await savePortfolio(body);

    // Invalidate Next.js cache so updates appear immediately on the main page
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/work");
      revalidatePath("/work/[slug]", "page");
    } catch (e) {
      console.error("Cache revalidation notice:", e);
    }

    return Response.json({
      success: true,
      version: result.version,
      content: result.content,
      message: "Portfolio updated and published successfully.",
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to validate or save portfolio." },
      { status: 400 }
    );
  }
}
