"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm({ ownerEmail }: { ownerEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send message. Please try emailing directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success">
        <CheckCircle2 size={44} className="success-icon" />
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. I’ll review your message and get back to you promptly.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn secondary"
          style={{ marginTop: "16px", padding: "8px 18px", fontSize: "14px" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-card">
      <div className="form-header">
        <h3>Send a message</h3>
        <p>Fill out this form and I&apos;ll get right back to you.</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="e.g. Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject">Topic / Subject (Optional)</label>
        <input
          id="contact-subject"
          type="text"
          placeholder="Project collaboration, hiring, or general question"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          required
          rows={4}
          placeholder="Tell me a bit about what you have in mind..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {status === "error" && (
        <div className="form-error">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
          <a href={`mailto:${ownerEmail}?subject=Portfolio%20Inquiry`} style={{ textDecoration: "underline", marginLeft: "4px" }}>
            Email directly
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn primary form-submit-btn"
      >
        <Send size={15} />
        {status === "sending" ? "Sending message..." : "Send Message"}
      </button>
    </form>
  );
}
