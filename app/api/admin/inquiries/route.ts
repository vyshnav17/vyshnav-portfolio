import { getMongoDb } from "@/lib/mongodb";
import { isOwner, checkMutation } from "@/lib/owner";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isOwner(req.headers)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = await getMongoDb();
    if (!db) {
      return Response.json({ inquiries: [], error: "Database not connected." });
    }

    const items = await db
      .collection("inquiries")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const inquiries = items.map((item) => ({
      id: item._id.toString(),
      name: item.name || "Anonymous",
      email: item.email || "",
      subject: item.subject || "No Subject",
      message: item.message || "",
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
      read: !!item.read,
    }));

    return Response.json({ inquiries });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Failed to load inquiries." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authError = checkMutation(req);
  if (authError) return authError;

  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) {
      return Response.json({ error: "Missing inquiry ID." }, { status: 400 });
    }

    const db = await getMongoDb();
    if (!db) {
      return Response.json({ error: "Database not connected." }, { status: 500 });
    }

    await db.collection("inquiries").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Failed to delete inquiry." }, { status: 500 });
  }
}
