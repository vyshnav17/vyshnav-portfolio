import { getMongoDb } from "@/lib/mongodb";
import { z } from "zod";
import nodemailer from "nodemailer";

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

    // 1. Store inquiry securely in MongoDB Atlas
    try {
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
    } catch (dbErr) {
      console.error("Failed to store inquiry in MongoDB:", dbErr);
    }

    // 2. Dispatch email to Gmail if EMAIL_PASS / GMAIL_APP_PASSWORD is set
    const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
    const emailUser = process.env.EMAIL_USER || "v17vyshnavtv@gmail.com";
    const recipient = process.env.CONTACT_RECIPIENT || "v17vyshnavtv@gmail.com";

    let emailSent = false;

    if (emailPass) {
      try {
        const cleanPass = emailPass.replace(/\s+/g, "");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: cleanPass,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${emailUser}>`,
          to: recipient,
          replyTo: email,
          subject: `[Portfolio Inquiry] ${subject || "Message from " + name}`,
          text: `New message from your portfolio website!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "Portfolio Contact"}\n\nMessage:\n${message}\n`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #111827; margin-top: 0; font-size: 20px;">New Message from Portfolio</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 100px;"><strong>Sender:</strong></td>
                  <td style="padding: 6px 0; color: #111827; font-size: 14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                  <td style="padding: 6px 0; color: #2563eb; font-size: 14px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong></td>
                  <td style="padding: 6px 0; color: #111827; font-size: 14px;">${subject || "Portfolio Contact"}</td>
                </tr>
              </table>
              <div style="margin-top: 16px;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase;">Message:</p>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #1f2937;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
              </div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                <a href="mailto:${email}" style="display: inline-block; background: #10b981; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 14px;">Reply directly to ${name}</a>
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error("Nodemailer error sending email:", mailErr);
      }
    } else {
      console.warn("EMAIL_PASS not set in environment variables. Inquiry stored in database.");
    }

    return Response.json({
      success: true,
      message: "Thank you! Your message has been received.",
      emailSent,
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to process inquiry." },
      { status: 500 }
    );
  }
}
