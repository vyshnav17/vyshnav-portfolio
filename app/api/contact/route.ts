import { getMongoDb } from "@/lib/mongodb";
import { z } from "zod";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(2, "Please write a message."),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = inquirySchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message || "Invalid form data." },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Store inquiry directly in MongoDB Atlas inquiries collection
    const db = await getMongoDb();
    if (db) {
      await db.collection("inquiries").insertOne({
        name,
        email,
        subject: subject || "Portfolio Contact",
        message,
        createdAt: new Date(),
        read: false,
      });
    }

    return Response.json({
      success: true,
      message: "Thank you! Your message has been received.",
    });
  } catch (error: any) {
    console.error("Inquiry submission error:", error);
    return Response.json(
      { error: error?.message || "Failed to process inquiry." },
      { status: 500 }
    );
  }
}
