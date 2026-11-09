import { resetPortfolio } from "@/lib/content";
import { checkMutation } from "@/lib/owner";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const authError = checkMutation(req);
  if (authError) return authError;

  try {
    const result = await resetPortfolio();
    return Response.json({
      success: true,
      version: result.version,
      content: result.content,
      message: "Portfolio reset to initial defaults.",
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to reset portfolio." },
      { status: 500 }
    );
  }
}

