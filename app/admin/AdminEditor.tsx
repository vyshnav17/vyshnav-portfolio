"use client";

import { useState, useEffect, useRef } from "react";
import type { Content, Project, Repository } from "@/data/schema";
import { validateDocument } from "@/data/schema";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  Check,
  AlertCircle,
  User,
  BookOpen,
  FolderGit2,
  Briefcase,
  Layers,
  GraduationCap,
  Sliders,
  Mail,
  Settings,
  Code,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  X,
  FileCode,
  Sparkles,
} from "lucide-react";

type Props = {
  initialContent: Content;
  initialVersion: number;
  isInitialOwner: boolean;
  initialDbStatus?: { connected: boolean; error?: string };
};

type Tab =
  | "profile"
  | "about"
  | "projects"
  | "repositories"
  | "experience"
  | "stack"
  | "education"
  | "sections"
  | "contact"
  | "site"
  | "json";

export default function AdminEditor({
  initialContent,
  initialVersion,
  isInitialOwner,
  initialDbStatus,
}: Props) {
  const [content, setContent] = useState<Content>(initialContent);
  const [version, setVersion] = useState(initialVersion);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOwnerState, setIsOwnerState] = useState(isInitialOwner);
  const [dbStatus, setDbStatus] = useState(
    initialDbStatus || { connected: false }
  );
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Sub-selections
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeRepoIdx, setActiveRepoIdx] = useState(0);
  const [repoSearch, setRepoSearch] = useState("");
  const [rawJsonText, setRawJsonText] = useState("");
  const [rawJsonError, setRawJsonError] = useState("");

  // Password Authentication
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<
    ((url: string) => void) | null
  >(null);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Sync raw JSON when tab opens or content changes
  useEffect(() => {
    if (activeTab === "json") {
      setRawJsonText(JSON.stringify(content, null, 2));
      setRawJsonError("");
    }
  }, [activeTab, content]);

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveAll();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [content, isSaving]);

  // Update root document safely
  function update<K extends keyof Content>(key: K, val: Content[K]) {
    setContent((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  }

  // Trigger file upload helper
  function triggerUpload(onSuccess: (url: string) => void) {
    setUploadTarget(() => onSuccess);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      showToast("Uploading file...", "info");
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Upload failed");
      uploadTarget(data.url);
      setIsDirty(true);
      showToast("File uploaded successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload file", "error");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadTarget(null);
    }
  }

  function showToast(msg: string, type: "success" | "error" | "info" = "info") {
    setToast({ msg, type });
  }

  // Save changes
  async function saveAll() {
    setIsSaving(true);
    try {
      // Validate schema on client first
      const validated = validateDocument(content);

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to publish");

      setContent(data.content);
      setVersion(data.version);
      setIsDirty(false);
      setDbStatus({ connected: true });
      showToast("All changes published successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save portfolio", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // Reset to defaults
  async function resetAll() {
    if (
      !confirm(
        "Are you sure you want to reset all portfolio content to factory defaults? Unsaved edits will be lost."
      )
    )
      return;

    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Reset failed");

      setContent(data.content);
      setVersion(data.version);
      setIsDirty(false);
      showToast("Portfolio reset to initial content.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to reset portfolio", "error");
    }
  }

  // Password Login & Logout handlers
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: loginPassword }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Login failed");
      setIsOwnerState(true);
      setLoginPassword("");
      showToast("Logged in successfully!", "success");
    } catch (err: any) {
      setLoginError(err.message || "Incorrect password");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setIsOwnerState(false);
      showToast("Logged out successfully", "info");
    } catch {}
  }

  // Apply Raw JSON
  function applyRawJson() {
    try {
      const parsed = JSON.parse(rawJsonText);
      const validated = validateDocument(parsed);
      setContent(validated);
      setIsDirty(true);
      setRawJsonError("");
      showToast("JSON validated and applied!", "success");
    } catch (err: any) {
      setRawJsonError(err.message || "Invalid JSON schema");
    }
  }

  // If not authenticated, display the dedicated Password Login gate
  if (!isOwnerState) {
    return (
      <div
        className="admin-root"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <div
          className="admin-panel-card"
          style={{
            maxWidth: "420px",
            width: "100%",
            padding: "36px 32px",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(182, 255, 105, 0.1)",
              border: "1px solid rgba(182, 255, 105, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              color: "var(--lime)",
            }}
          >
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
            Portfolio Admin Login
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            Enter your admin password to edit your portfolio content and settings.
          </p>

          <form onSubmit={handleLogin}>
            <div
              className="admin-form-group"
              style={{ textAlign: "left", marginBottom: "18px" }}
            >
              <label className="admin-form-label">Admin Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="admin-input"
                  style={{ paddingRight: "40px" }}
                  placeholder="Enter admin password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div
                style={{
                  background: "rgba(255, 77, 77, 0.12)",
                  border: "1px solid rgba(255, 77, 77, 0.3)",
                  color: "#ff6b6b",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  fontFamily: "var(--mono)",
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "12px",
                fontSize: "15px",
              }}
            >
              {isLoggingIn ? "Verifying..." : "Sign In to Admin"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "18px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <a
              href="/"
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              ← Back to Site
            </a>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--mono)",
                color: "var(--sub)",
              }}
            >
              Protected Session
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Sticky top action bar */}
      <header className="admin-header-bar">
        <div className="container admin-bar-inner">
          <div className="admin-brand-group">
            <a href="/" className="brand" style={{ gap: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "17px" }}>
                {content.site.brand}
                <span className="muted">{content.site.brandSuffix}</span>
              </span>
            </a>
            <span className="admin-badge">Admin Dashboard</span>
            {isDirty ? (
              <span className="admin-badge unsaved">Unsaved changes</span>
            ) : (
              <span
                className="admin-badge"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "var(--line)",
                  color: "var(--muted)",
                }}
              >
                v{version} Published
              </span>
            )}

            {dbStatus.connected ? (
              <span
                className="admin-badge"
                style={{
                  background: "rgba(182, 255, 105, 0.12)",
                  borderColor: "rgba(182, 255, 105, 0.3)",
                  color: "var(--lime)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                title="Connected to MongoDB Atlas"
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--lime)",
                  }}
                />
                MongoDB Live
              </span>
            ) : (
              <span
                className="admin-badge unsaved"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
                title={dbStatus.error || "MongoDB not connected"}
                onClick={() =>
                  alert(`Database Status:\n\n${dbStatus.error || "Not connected"}`)
                }
              >
                <AlertCircle size={12} />
                No Database Connected
              </span>
            )}
          </div>

          <div className="admin-actions-group">
            <button
              onClick={handleLogout}
              className="admin-icon-btn danger"
              style={{ gap: "6px", padding: "6px 12px", fontSize: "13px" }}
              title="Log out of admin"
            >
              <Lock size={14} />
              <span>Log Out</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-icon-btn"
              style={{ gap: "6px", padding: "6px 12px", fontSize: "13px" }}
            >
              <ExternalLink size={14} />
              View Site
            </a>

            <button
              onClick={resetAll}
              className="admin-icon-btn danger"
              style={{ gap: "6px", padding: "6px 12px", fontSize: "13px" }}
              title="Reset to factory initial.json"
            >
              <RotateCcw size={14} />
              Reset
            </button>

            <button
              onClick={saveAll}
              disabled={isSaving}
              className="btn primary"
              style={{
                padding: "8px 18px",
                fontSize: "14px",
                gap: "8px",
                boxShadow: isDirty ? "0 0 16px rgba(182, 255, 105, 0.4)" : "none",
              }}
            >
              <Save size={16} />
              {isSaving ? "Publishing..." : "Save & Publish"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container">
        {!dbStatus.connected && (
          <div
            style={{
              background: "rgba(255, 187, 0, 0.08)",
              border: "1px solid rgba(255, 187, 0, 0.25)",
              color: "#ffc107",
              padding: "12px 18px",
              borderRadius: "8px",
              marginTop: "20px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Database Warning:</strong> {dbStatus.error || "MongoDB Atlas is not connected yet. Edits cannot persist across Vercel deployments until MONGODB_URI is set."}
              <div style={{ marginTop: "4px", fontSize: "12px", color: "var(--text)" }}>
                In Vercel → Project Settings → <strong>Environment Variables</strong>, verify <code>MONGODB_URI</code> and click <strong>Redeploy</strong>.
              </div>
            </div>
          </div>
        )}

        <div className="admin-layout-grid">
          {/* Navigation Sidebar */}
          <aside className="admin-sidebar">
            <button
              className={`admin-tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <span className="admin-tab-inner">
                <User size={16} /> Profile & Bio
              </span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <span className="admin-tab-inner">
                <BookOpen size={16} /> About Me
              </span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              <span className="admin-tab-inner">
                <Layers size={16} /> Projects
              </span>
              <span className="admin-tab-count">
                {content.projects.length}
              </span>
            </button>

            <button
              className={`admin-tab-btn ${
                activeTab === "repositories" ? "active" : ""
              }`}
              onClick={() => setActiveTab("repositories")}
            >
              <span className="admin-tab-inner">
                <FolderGit2 size={16} /> Repositories
              </span>
              <span className="admin-tab-count">
                {content.repositories.length}
              </span>
            </button>

            <button
              className={`admin-tab-btn ${
                activeTab === "experience" ? "active" : ""
              }`}
              onClick={() => setActiveTab("experience")}
            >
              <span className="admin-tab-inner">
                <Briefcase size={16} /> Experience
              </span>
              <span className="admin-tab-count">
                {content.experience.length}
              </span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === "stack" ? "active" : ""}`}
              onClick={() => setActiveTab("stack")}
            >
              <span className="admin-tab-inner">
                <Code size={16} /> Tech Stack
              </span>
              <span className="admin-tab-count">{content.stack.length}</span>
            </button>

            <button
              className={`admin-tab-btn ${
                activeTab === "education" ? "active" : ""
              }`}
              onClick={() => setActiveTab("education")}
            >
              <span className="admin-tab-inner">
                <GraduationCap size={16} /> Education & Certs
              </span>
            </button>

            <button
              className={`admin-tab-btn ${
                activeTab === "sections" ? "active" : ""
              }`}
              onClick={() => setActiveTab("sections")}
            >
              <span className="admin-tab-inner">
                <Sliders size={16} /> Sections & Nav
              </span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              <span className="admin-tab-inner">
                <Mail size={16} /> Contact
              </span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === "site" ? "active" : ""}`}
              onClick={() => setActiveTab("site")}
            >
              <span className="admin-tab-inner">
                <Settings size={16} /> Site & Brand
              </span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === "json" ? "active" : ""}`}
              onClick={() => setActiveTab("json")}
            >
              <span className="admin-tab-inner">
                <FileCode size={16} /> Raw JSON Backup
              </span>
            </button>
          </aside>

          {/* Tab Content Panes */}
          <main className="admin-content-pane">
            {activeTab === "profile" && (
              <ProfileEditor
                profile={content.profile}
                onChange={(p) => update("profile", p)}
                onUpload={triggerUpload}
              />
            )}

            {activeTab === "about" && (
              <AboutEditor
                about={content.about}
                onChange={(a) => update("about", a)}
              />
            )}

            {activeTab === "projects" && (
              <ProjectsEditor
                projects={content.projects}
                activeIdx={activeProjectIdx}
                onSelectIdx={setActiveProjectIdx}
                onChange={(p) => update("projects", p)}
                onUpload={triggerUpload}
              />
            )}

            {activeTab === "repositories" && (
              <RepositoriesEditor
                repositories={content.repositories}
                projects={content.projects}
                activeIdx={activeRepoIdx}
                onSelectIdx={setActiveRepoIdx}
                search={repoSearch}
                onSearch={setRepoSearch}
                onChange={(r) => update("repositories", r)}
                onUpload={triggerUpload}
              />
            )}

            {activeTab === "experience" && (
              <ExperienceEditor
                experience={content.experience}
                onChange={(exp) => update("experience", exp)}
              />
            )}

            {activeTab === "stack" && (
              <StackEditor
                stack={content.stack}
                onChange={(s) => update("stack", s)}
              />
            )}

            {activeTab === "education" && (
              <EducationEditor
                education={content.education}
                certificates={content.certificates}
                onChangeEdu={(e) => update("education", e)}
                onChangeCert={(c) => update("certificates", c)}
              />
            )}

            {activeTab === "sections" && (
              <SectionsEditor
                sections={content.sections}
                onChange={(sec) => update("sections", sec)}
              />
            )}

            {activeTab === "contact" && (
              <ContactEditor
                contact={content.contact}
                email={content.profile.email}
                onChange={(c) => update("contact", c)}
              />
            )}

            {activeTab === "site" && (
              <SiteEditor
                site={content.site}
                onChange={(s) => update("site", s)}
                onUpload={triggerUpload}
              />
            )}

            {activeTab === "json" && (
              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <h2>Raw Document JSON</h2>
                  <p>
                    Directly view, backup, or import your entire portfolio
                    configuration as valid JSON.
                  </p>
                </div>
                {rawJsonError && (
                  <div
                    style={{
                      background: "rgba(255, 77, 77, 0.1)",
                      border: "1px solid rgba(255, 77, 77, 0.3)",
                      color: "#ff6b6b",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      marginBottom: "14px",
                      fontSize: "13px",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    Error: {rawJsonError}
                  </div>
                )}
                <div className="admin-form-group">
                  <textarea
                    className="admin-textarea"
                    style={{
                      minHeight: "440px",
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      lineHeight: "1.4",
                    }}
                    value={rawJsonText}
                    onChange={(e) => setRawJsonText(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={applyRawJson}
                    className="btn primary"
                    style={{ padding: "8px 18px", fontSize: "14px" }}
                  >
                    <Check size={16} /> Validate & Apply JSON
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawJsonText);
                      showToast("JSON copied to clipboard!", "success");
                    }}
                    className="admin-icon-btn"
                    style={{ padding: "8px 16px" }}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {toast && (
        <div className="admin-toast">
          {toast.type === "success" && (
            <Check size={18} style={{ color: "var(--lime)" }} />
          )}
          {toast.type === "error" && (
            <AlertCircle size={18} style={{ color: "#ff5555" }} />
          )}
          {toast.type === "info" && (
            <Sparkles size={18} style={{ color: "var(--lime)" }} />
          )}
          <span style={{ fontSize: "14px" }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. Profile Editor
// ----------------------------------------------------------------------
function ProfileEditor({
  profile,
  onChange,
  onUpload,
}: {
  profile: Content["profile"];
  onChange: (p: Content["profile"]) => void;
  onUpload: (cb: (url: string) => void) => void;
}) {
  function set<K extends keyof Content["profile"]>(
    k: K,
    v: Content["profile"][K]
  ) {
    onChange({ ...profile, [k]: v });
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h2>Hero Profile & Identity</h2>
        <p>
          Configure your personal headline, roles, contact links, portrait, and
          resume.
        </p>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Full Name</label>
          <input
            className="admin-input"
            value={profile.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Primary Role</label>
          <input
            className="admin-input"
            value={profile.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Specialty</label>
          <input
            className="admin-input"
            value={profile.specialty}
            onChange={(e) => set("specialty", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Status Badge</label>
          <input
            className="admin-input"
            value={profile.status}
            onChange={(e) => set("status", e.target.value)}
          />
          <span className="admin-help">
            Appears with a live pulsing dot in the hero header.
          </span>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Headline</label>
        <textarea
          className="admin-textarea"
          style={{ minHeight: "65px" }}
          value={profile.headline}
          onChange={(e) => set("headline", e.target.value)}
        />
        <span className="admin-help">
          Line breaks in this field will render on separate lines in the hero
          title.
        </span>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Introduction Bio</label>
        <textarea
          className="admin-textarea"
          value={profile.introduction}
          onChange={(e) => set("introduction", e.target.value)}
        />
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Location</label>
          <input
            className="admin-input"
            value={profile.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Email Address</label>
          <input
            type="email"
            className="admin-input"
            value={profile.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">GitHub URL</label>
          <input
            className="admin-input"
            value={profile.github}
            onChange={(e) => set("github", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">LinkedIn URL</label>
          <input
            className="admin-input"
            value={profile.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Work Button Label</label>
          <input
            className="admin-input"
            value={profile.workButton}
            onChange={(e) => set("workButton", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Resume Button Label</label>
          <input
            className="admin-input"
            value={profile.resumeButton}
            onChange={(e) => set("resumeButton", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Portrait Image</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              className="admin-input"
              value={profile.portrait}
              onChange={(e) => set("portrait", e.target.value)}
              placeholder="/vyshnav-portrait-880.webp"
            />
            <button
              onClick={() => onUpload((url) => set("portrait", url))}
              className="admin-icon-btn"
              title="Upload portrait file"
            >
              <Upload size={16} />
            </button>
          </div>
          {profile.portrait && (
            <div className="admin-image-preview-box">
              <img
                src={profile.portrait}
                alt="Portrait preview"
                className="admin-thumb"
              />
              <span className="admin-help">Portrait thumbnail</span>
            </div>
          )}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Portrait Alt Text</label>
          <input
            className="admin-input"
            value={profile.portraitAlt}
            onChange={(e) => set("portraitAlt", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Resume File URL</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            className="admin-input"
            value={profile.resume}
            onChange={(e) => set("resume", e.target.value)}
            placeholder="/Vyshnav-TV-Resume.pdf"
          />
          <button
            onClick={() => onUpload((url) => set("resume", url))}
            className="admin-icon-btn"
            title="Upload PDF resume"
          >
            <Upload size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. About Me Editor
// ----------------------------------------------------------------------
function AboutEditor({
  about,
  onChange,
}: {
  about: Content["about"];
  onChange: (a: Content["about"]) => void;
}) {
  function updateParagraph(index: number, text: string) {
    const list = [...about.paragraphs];
    list[index] = text;
    onChange({ ...about, paragraphs: list });
  }

  function addParagraph() {
    onChange({ ...about, paragraphs: [...about.paragraphs, ""] });
  }

  function removeParagraph(index: number) {
    onChange({
      ...about,
      paragraphs: about.paragraphs.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h2>About Me Section</h2>
        <p>Edit your narrative paragraphs and quick institution facts.</p>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Lead Introduction</label>
        <textarea
          className="admin-textarea"
          value={about.introduction}
          onChange={(e) => onChange({ ...about, introduction: e.target.value })}
        />
        <span className="admin-help">
          The prominent larger lead paragraph at the start of the About
          section.
        </span>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">University / Affiliation</label>
          <input
            className="admin-input"
            value={about.university}
            onChange={(e) => onChange({ ...about, university: e.target.value })}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Location / Base</label>
          <input
            className="admin-input"
            value={about.location}
            onChange={(e) => onChange({ ...about, location: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-form-group">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label className="admin-form-label" style={{ margin: 0 }}>
            Story Paragraphs ({about.paragraphs.length})
          </label>
          <button
            onClick={addParagraph}
            className="admin-icon-btn"
            style={{ gap: "4px", padding: "4px 10px", fontSize: "12px" }}
          >
            <Plus size={14} /> Add Paragraph
          </button>
        </div>

        {about.paragraphs.map((p, idx) => (
          <div key={idx} className="admin-item-box">
            <div className="admin-item-topbar">
              <span className="admin-item-title">Paragraph 0{idx + 1}</span>
              <button
                onClick={() => removeParagraph(idx)}
                className="admin-icon-btn danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              className="admin-textarea"
              value={p}
              onChange={(e) => updateParagraph(idx, e.target.value)}
              placeholder="Write story paragraph..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. Featured Projects Editor
// ----------------------------------------------------------------------
function ProjectsEditor({
  projects,
  activeIdx,
  onSelectIdx,
  onChange,
  onUpload,
}: {
  projects: Content["projects"];
  activeIdx: number;
  onSelectIdx: (idx: number) => void;
  onChange: (projects: Content["projects"]) => void;
  onUpload: (cb: (url: string) => void) => void;
}) {
  const current = projects[activeIdx] || projects[0];

  function setProject(updated: Project) {
    const list = [...projects];
    list[activeIdx] = updated;
    onChange(list);
  }

  function addProject() {
    const newP: Project = {
      slug: "new-project-" + Date.now().toString(36),
      title: "New Featured Project",
      short: "New Project",
      category: "Full-stack Engineering",
      period: "2026",
      description: "Brief summary of what this project achieves.",
      problem: "Describe the real-world challenge this addresses.",
      solution: "Describe the architecture and system solution built.",
      tech: ["TypeScript", "Next.js", "Tailwind CSS"],
      implementation: [
        {
          title: "System Architecture",
          body: "Implementation details of the system.",
        },
      ],
      features: ["Real-time synchronization", "Intuitive user interface"],
      link: "https://github.com/vyshnav17",
      linkName: "View repository",
      live: "",
      image: "/social-card.png",
      imageAlt: "Screenshot of project",
      caption: "Project interface overview",
      additionalImage: "",
      additionalCaption: "",
      guideTitle: "Project Walkthrough",
      guide: [],
      progressGuide: false,
    };
    onChange([...projects, newP]);
    onSelectIdx(projects.length);
  }

  function deleteProject(idx: number) {
    if (projects.length <= 1) {
      alert("You must keep at least one featured project.");
      return;
    }
    if (!confirm("Are you sure you want to delete this case study?")) return;
    const list = projects.filter((_, i) => i !== idx);
    onChange(list);
    onSelectIdx(Math.max(0, activeIdx - 1));
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= projects.length) return;
    const list = [...projects];
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    onChange(list);
    onSelectIdx(target);
  }

  if (!current) return null;

  return (
    <div>
      {/* Project selector strip */}
      <div
        className="admin-panel-card"
        style={{ padding: "16px", marginBottom: "18px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "13px",
              color: "var(--muted)",
            }}
          >
            SELECT PROJECT ({projects.length})
          </span>
          <button
            onClick={addProject}
            className="btn primary"
            style={{ padding: "6px 14px", fontSize: "13px", gap: "6px" }}
          >
            <Plus size={14} /> Add Case Study
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {projects.map((p, idx) => (
            <div
              key={p.slug || idx}
              style={{
                display: "flex",
                alignItems: "center",
                background:
                  idx === activeIdx ? "rgba(182, 255, 105, 0.1)" : "var(--panel2)",
                border: `1px solid ${
                  idx === activeIdx ? "var(--lime)" : "var(--line)"
                }`,
                borderRadius: "8px",
                padding: "6px 10px",
                gap: "6px",
              }}
            >
              <button
                onClick={() => onSelectIdx(idx)}
                style={{
                  background: "none",
                  border: "none",
                  color: idx === activeIdx ? "var(--lime)" : "var(--text)",
                  fontWeight: 600,
                  fontSize: "13px",
                  textAlign: "left",
                }}
              >
                0{idx + 1}. {p.short || p.title}
              </button>
              <button
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="admin-icon-btn"
                style={{ padding: "2px 4px" }}
                title="Move up"
              >
                <ChevronUp size={12} />
              </button>
              <button
                onClick={() => move(idx, 1)}
                disabled={idx === projects.length - 1}
                className="admin-icon-btn"
                style={{ padding: "2px 4px" }}
                title="Move down"
              >
                <ChevronDown size={12} />
              </button>
              <button
                onClick={() => deleteProject(idx)}
                className="admin-icon-btn danger"
                style={{ padding: "2px 4px" }}
                title="Delete project"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Project Full Editor */}
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <h2>Edit Case Study: {current.title}</h2>
          <p>
            Public URL: <code>/work/{current.slug}/</code>
          </p>
        </div>

        <div className="admin-grid-3">
          <div className="admin-form-group">
            <label className="admin-form-label">Full Title</label>
            <input
              className="admin-input"
              value={current.title}
              onChange={(e) =>
                setProject({ ...current, title: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Short Name (Card Title)</label>
            <input
              className="admin-input"
              value={current.short}
              onChange={(e) =>
                setProject({ ...current, short: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">URL Slug</label>
            <input
              className="admin-input"
              value={current.slug}
              onChange={(e) =>
                setProject({
                  ...current,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                })
              }
            />
            <span className="admin-help">
              Lowercase letters, numbers and hyphens.
            </span>
          </div>
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Category</label>
            <input
              className="admin-input"
              value={current.category}
              onChange={(e) =>
                setProject({ ...current, category: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Time Period</label>
            <input
              className="admin-input"
              value={current.period}
              onChange={(e) =>
                setProject({ ...current, period: e.target.value })
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Summary / Description</label>
          <textarea
            className="admin-textarea"
            value={current.description}
            onChange={(e) =>
              setProject({ ...current, description: e.target.value })
            }
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">The Problem</label>
            <textarea
              className="admin-textarea"
              style={{ minHeight: "100px" }}
              value={current.problem}
              onChange={(e) =>
                setProject({ ...current, problem: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">The Solution</label>
            <textarea
              className="admin-textarea"
              style={{ minHeight: "100px" }}
              value={current.solution}
              onChange={(e) =>
                setProject({ ...current, solution: e.target.value })
              }
            />
          </div>
        </div>

        {/* Technologies Tags */}
        <div className="admin-form-group">
          <label className="admin-form-label">Technologies Used</label>
          <ChipsManager
            tags={current.tech}
            onChange={(tech) => setProject({ ...current, tech })}
          />
        </div>

        {/* Links */}
        <div className="admin-grid-3">
          <div className="admin-form-group">
            <label className="admin-form-label">Primary Link URL</label>
            <input
              className="admin-input"
              value={current.link}
              onChange={(e) => setProject({ ...current, link: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Link Button Text</label>
            <input
              className="admin-input"
              value={current.linkName}
              onChange={(e) =>
                setProject({ ...current, linkName: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Live Site URL (Optional)</label>
            <input
              className="admin-input"
              value={current.live || ""}
              onChange={(e) => setProject({ ...current, live: e.target.value })}
            />
          </div>
        </div>

        {/* Hero Visual Media */}
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Hero Image / Screenshot</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                className="admin-input"
                value={current.image || ""}
                onChange={(e) =>
                  setProject({ ...current, image: e.target.value })
                }
              />
              <button
                onClick={() =>
                  onUpload((url) => setProject({ ...current, image: url }))
                }
                className="admin-icon-btn"
                title="Upload image"
              >
                <Upload size={16} />
              </button>
            </div>
            {current.image && (
              <div className="admin-image-preview-box">
                <img
                  src={current.image}
                  alt={current.imageAlt || "Preview"}
                  className="admin-thumb"
                  style={{ width: "90px", height: "55px" }}
                />
                <span className="admin-help">{current.caption}</span>
              </div>
            )}
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Image Caption</label>
            <input
              className="admin-input"
              value={current.caption || ""}
              onChange={(e) =>
                setProject({ ...current, caption: e.target.value })
              }
            />
          </div>
        </div>

        {/* Implementation Steps */}
        <div className="admin-form-group" style={{ marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <label className="admin-form-label" style={{ margin: 0 }}>
              Implementation Workflow Steps ({current.implementation.length})
            </label>
            <button
              onClick={() =>
                setProject({
                  ...current,
                  implementation: [
                    ...current.implementation,
                    { title: "New Step", body: "Step description..." },
                  ],
                })
              }
              className="admin-icon-btn"
              style={{ gap: "4px", padding: "4px 10px", fontSize: "12px" }}
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          {current.implementation.map((step, sIdx) => (
            <div key={sIdx} className="admin-item-box">
              <div className="admin-item-topbar">
                <span className="admin-item-title">Step 0{sIdx + 1}</span>
                <button
                  onClick={() =>
                    setProject({
                      ...current,
                      implementation: current.implementation.filter(
                        (_, i) => i !== sIdx
                      ),
                    })
                  }
                  className="admin-icon-btn danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="admin-form-group">
                <input
                  className="admin-input"
                  style={{ marginBottom: "8px" }}
                  value={step.title}
                  onChange={(e) => {
                    const list = [...current.implementation];
                    list[sIdx] = { ...step, title: e.target.value };
                    setProject({ ...current, implementation: list });
                  }}
                  placeholder="Step title (e.g. Configure, Calculate, Follow up)"
                />
                <textarea
                  className="admin-textarea"
                  value={step.body}
                  onChange={(e) => {
                    const list = [...current.implementation];
                    list[sIdx] = { ...step, body: e.target.value };
                    setProject({ ...current, implementation: list });
                  }}
                  placeholder="Detailed description of what happens in this step..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div className="admin-form-group" style={{ marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <label className="admin-form-label" style={{ margin: 0 }}>
              Key Features Bullet Points ({current.features.length})
            </label>
            <button
              onClick={() =>
                setProject({
                  ...current,
                  features: [...current.features, "New feature capability"],
                })
              }
              className="admin-icon-btn"
              style={{ gap: "4px", padding: "4px 10px", fontSize: "12px" }}
            >
              <Plus size={14} /> Add Feature
            </button>
          </div>

          {current.features.map((feat, fIdx) => (
            <div
              key={fIdx}
              style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
            >
              <input
                className="admin-input"
                value={feat}
                onChange={(e) => {
                  const list = [...current.features];
                  list[fIdx] = e.target.value;
                  setProject({ ...current, features: list });
                }}
              />
              <button
                onClick={() =>
                  setProject({
                    ...current,
                    features: current.features.filter((_, i) => i !== fIdx),
                  })
                }
                className="admin-icon-btn danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. GitHub Repositories Archive Editor
// ----------------------------------------------------------------------
function RepositoriesEditor({
  repositories,
  projects,
  activeIdx,
  onSelectIdx,
  search,
  onSearch,
  onChange,
  onUpload,
}: {
  repositories: Content["repositories"];
  projects: Content["projects"];
  activeIdx: number;
  onSelectIdx: (idx: number) => void;
  search: string;
  onSearch: (s: string) => void;
  onChange: (r: Content["repositories"]) => void;
  onUpload: (cb: (url: string) => void) => void;
}) {
  const current = repositories[activeIdx] || repositories[0];

  function setRepo(updated: Repository) {
    const list = [...repositories];
    list[activeIdx] = updated;
    onChange(list);
  }

  function addRepo() {
    const newRepo: Repository = {
      title: "New Open Source Repository",
      name: "new-repo-" + Date.now().toString(36),
      category: "Full-stack",
      summary: "Description of open source project on GitHub.",
      url: "https://github.com/vyshnav17/new-repo",
      language: "TypeScript",
      status: "source",
      upstream: "",
      live: "",
      caseStudy: "",
      screenshot: "",
      files: [],
    };
    onChange([newRepo, ...repositories]);
    onSelectIdx(0);
  }

  function deleteRepo(idx: number) {
    if (!confirm("Delete this repository from the archive?")) return;
    const list = repositories.filter((_, i) => i !== idx);
    onChange(list);
    onSelectIdx(Math.max(0, activeIdx - 1));
  }

  const filtered = repositories.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Top search & add bar */}
      <div
        className="admin-panel-card"
        style={{ padding: "16px", marginBottom: "18px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <input
            className="admin-input"
            style={{ maxWidth: "300px" }}
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button
            onClick={addRepo}
            className="btn primary"
            style={{ padding: "6px 14px", fontSize: "13px", gap: "6px" }}
          >
            <Plus size={14} /> Add Repository
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            marginTop: "12px",
            paddingBottom: "4px",
          }}
        >
          {filtered.map((r) => {
            const realIdx = repositories.indexOf(r);
            return (
              <button
                key={r.name}
                onClick={() => onSelectIdx(realIdx)}
                style={{
                  background:
                    realIdx === activeIdx
                      ? "rgba(182, 255, 105, 0.1)"
                      : "var(--panel2)",
                  border: `1px solid ${
                    realIdx === activeIdx ? "var(--lime)" : "var(--line)"
                  }`,
                  color: realIdx === activeIdx ? "var(--lime)" : "var(--text)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {r.name}
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <div className="admin-panel-card">
          <div
            className="admin-panel-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h2>Edit Repository: {current.title}</h2>
              <p>GitHub name: @vyshnav17/{current.name}</p>
            </div>
            <button
              onClick={() => deleteRepo(activeIdx)}
              className="admin-icon-btn danger"
              style={{ gap: "6px", padding: "6px 12px" }}
            >
              <Trash2 size={14} /> Delete Repo
            </button>
          </div>

          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-form-label">Repository Title</label>
              <input
                className="admin-input"
                value={current.title}
                onChange={(e) => setRepo({ ...current, title: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">GitHub Repo Name</label>
              <input
                className="admin-input"
                value={current.name}
                onChange={(e) => setRepo({ ...current, name: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <input
                className="admin-input"
                value={current.category}
                onChange={(e) =>
                  setRepo({ ...current, category: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Summary / Description</label>
            <textarea
              className="admin-textarea"
              value={current.summary}
              onChange={(e) => setRepo({ ...current, summary: e.target.value })}
            />
          </div>

          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-form-label">GitHub URL</label>
              <input
                className="admin-input"
                value={current.url}
                onChange={(e) => setRepo({ ...current, url: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Primary Language</label>
              <input
                className="admin-input"
                value={current.language}
                onChange={(e) =>
                  setRepo({ ...current, language: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Published Status</label>
              <select
                className="admin-select"
                value={current.status}
                onChange={(e) =>
                  setRepo({
                    ...current,
                    status: e.target.value as "source" | "readme" | "empty",
                  })
                }
              >
                <option value="source">Source code</option>
                <option value="readme">README only</option>
                <option value="empty">Empty repository</option>
              </select>
            </div>
          </div>

          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-form-label">Live Site URL</label>
              <input
                className="admin-input"
                value={current.live || ""}
                onChange={(e) => setRepo({ ...current, live: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Upstream Fork URL</label>
              <input
                className="admin-input"
                value={current.upstream || ""}
                onChange={(e) =>
                  setRepo({ ...current, upstream: e.target.value })
                }
                placeholder="https://github.com/..."
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Link to Case Study</label>
              <select
                className="admin-select"
                value={current.caseStudy || ""}
                onChange={(e) =>
                  setRepo({ ...current, caseStudy: e.target.value })
                }
              >
                <option value="">None (Stand-alone Repository)</option>
                {projects.map((p) => (
                  <option key={p.slug} value={`/work/${p.slug}/`}>
                    Case Study: {p.short || p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Screenshot Image</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                className="admin-input"
                value={current.screenshot || ""}
                onChange={(e) =>
                  setRepo({ ...current, screenshot: e.target.value })
                }
                placeholder="/work/repo-shot.webp"
              />
              <button
                onClick={() =>
                  onUpload((url) => setRepo({ ...current, screenshot: url }))
                }
                className="admin-icon-btn"
                title="Upload screenshot"
              >
                <Upload size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. Experience Editor
// ----------------------------------------------------------------------
function ExperienceEditor({
  experience,
  onChange,
}: {
  experience: Content["experience"];
  onChange: (exp: Content["experience"]) => void;
}) {
  function addExp() {
    const newItem = {
      role: "Software Engineer",
      org: "Organization Name",
      date: "2026",
      place: "Kannur, Kerala",
      type: "Full-time",
      body: "Description of key projects, achievements and technologies.",
    };
    onChange([newItem, ...experience]);
  }

  function removeExp(idx: number) {
    onChange(experience.filter((_, i) => i !== idx));
  }

  function updateExp(idx: number, item: Content["experience"][number]) {
    const list = [...experience];
    list[idx] = item;
    onChange(list);
  }

  return (
    <div className="admin-panel-card">
      <div
        className="admin-panel-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Work Experience & Internships</h2>
          <p>Chronological career timeline displayed on the homepage.</p>
        </div>
        <button
          onClick={addExp}
          className="btn primary"
          style={{ padding: "6px 14px", fontSize: "13px", gap: "6px" }}
        >
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {experience.map((item, idx) => (
        <div key={idx} className="admin-item-box">
          <div className="admin-item-topbar">
            <span className="admin-item-title">
              {item.role} · {item.org}
            </span>
            <button
              onClick={() => removeExp(idx)}
              className="admin-icon-btn danger"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Job Title / Role</label>
              <input
                className="admin-input"
                value={item.role}
                onChange={(e) =>
                  updateExp(idx, { ...item, role: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Company / Organization</label>
              <input
                className="admin-input"
                value={item.org}
                onChange={(e) =>
                  updateExp(idx, { ...item, org: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-form-label">Date Range</label>
              <input
                className="admin-input"
                value={item.date}
                onChange={(e) =>
                  updateExp(idx, { ...item, date: e.target.value })
                }
                placeholder="JUL — AUG 2026"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Location</label>
              <input
                className="admin-input"
                value={item.place}
                onChange={(e) =>
                  updateExp(idx, { ...item, place: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Role Type</label>
              <input
                className="admin-input"
                value={item.type}
                onChange={(e) =>
                  updateExp(idx, { ...item, type: e.target.value })
                }
                placeholder="Freelance project / Internship"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Responsibilities & Impact</label>
            <textarea
              className="admin-textarea"
              value={item.body}
              onChange={(e) =>
                updateExp(idx, { ...item, body: e.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. Tech Stack Editor
// ----------------------------------------------------------------------
function StackEditor({
  stack,
  onChange,
}: {
  stack: Content["stack"];
  onChange: (s: Content["stack"]) => void;
}) {
  function addCategory() {
    onChange([
      ...stack,
      { title: "New Category", technologies: ["Technology 1"] },
    ]);
  }

  function removeCategory(idx: number) {
    onChange(stack.filter((_, i) => i !== idx));
  }

  function updateCategory(idx: number, title: string) {
    const list = [...stack];
    list[idx] = { ...list[idx], title };
    onChange(list);
  }

  function updateTechs(idx: number, technologies: string[]) {
    const list = [...stack];
    list[idx] = { ...list[idx], technologies };
    onChange(list);
  }

  return (
    <div className="admin-panel-card">
      <div
        className="admin-panel-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Tech Stack & Skills</h2>
          <p>
            Organized categorized skill sets shown with interactive icons on the
            homepage.
          </p>
        </div>
        <button
          onClick={addCategory}
          className="btn primary"
          style={{ padding: "6px 14px", fontSize: "13px", gap: "6px" }}
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {stack.map((cat, idx) => (
        <div key={idx} className="admin-item-box">
          <div className="admin-item-topbar">
            <input
              className="admin-input"
              style={{
                maxWidth: "260px",
                fontWeight: 600,
                borderColor: "var(--line)",
              }}
              value={cat.title}
              onChange={(e) => updateCategory(idx, e.target.value)}
            />
            <button
              onClick={() => removeCategory(idx)}
              className="admin-icon-btn danger"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Technologies (Type & Enter)</label>
            <ChipsManager
              tags={cat.technologies}
              onChange={(tags) => updateTechs(idx, tags)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// 7. Education & Certifications Editor
// ----------------------------------------------------------------------
function EducationEditor({
  education,
  certificates,
  onChangeEdu,
  onChangeCert,
}: {
  education: Content["education"];
  certificates: Content["certificates"];
  onChangeEdu: (e: Content["education"]) => void;
  onChangeCert: (c: Content["certificates"]) => void;
}) {
  return (
    <div>
      {/* Education */}
      <div className="admin-panel-card">
        <div
          className="admin-panel-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Education Degrees & Diplomas</h2>
            <p>Academic milestones.</p>
          </div>
          <button
            onClick={() =>
              onChangeEdu([
                ...education,
                {
                  title: "Bachelor of Technology",
                  period: "2023 — 2027",
                  institution: "University",
                },
              ])
            }
            className="btn primary"
            style={{ padding: "6px 14px", fontSize: "13px", gap: "6px" }}
          >
            <Plus size={14} /> Add Degree
          </button>
        </div>

        {education.map((edu, idx) => (
          <div key={idx} className="admin-item-box">
            <div className="admin-item-topbar">
              <span className="admin-item-title">{edu.title}</span>
              <button
                onClick={() =>
                  onChangeEdu(education.filter((_, i) => i !== idx))
                }
                className="admin-icon-btn danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-form-label">Degree / Title</label>
                <input
                  className="admin-input"
                  value={edu.title}
                  onChange={(e) => {
                    const list = [...education];
                    list[idx] = { ...edu, title: e.target.value };
                    onChangeEdu(list);
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Period</label>
                <input
                  className="admin-input"
                  value={edu.period}
                  onChange={(e) => {
                    const list = [...education];
                    list[idx] = { ...edu, period: e.target.value };
                    onChangeEdu(list);
                  }}
                  placeholder="2023 — 2027"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Institution</label>
                <input
                  className="admin-input"
                  value={edu.institution}
                  onChange={(e) => {
                    const list = [...education];
                    list[idx] = { ...edu, institution: e.target.value };
                    onChangeEdu(list);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificates */}
      <div className="admin-panel-card">
        <div
          className="admin-panel-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Certifications & Honors</h2>
            <p>Industry certifications.</p>
          </div>
          <button
            onClick={() =>
              onChangeCert([
                ...certificates,
                { issuer: "IBM", title: "Certification Title" },
              ])
            }
            className="btn primary"
            style={{ padding: "6px 14px", fontSize: "13px", gap: "6px" }}
          >
            <Plus size={14} /> Add Certificate
          </button>
        </div>

        <div className="admin-grid-2">
          {certificates.map((cert, idx) => (
            <div key={idx} className="admin-item-box">
              <div className="admin-item-topbar">
                <span className="admin-item-title">{cert.issuer}</span>
                <button
                  onClick={() =>
                    onChangeCert(certificates.filter((_, i) => i !== idx))
                  }
                  className="admin-icon-btn danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Issuer</label>
                <input
                  className="admin-input"
                  value={cert.issuer}
                  onChange={(e) => {
                    const list = [...certificates];
                    list[idx] = { ...cert, issuer: e.target.value };
                    onChangeCert(list);
                  }}
                  placeholder="IBM / Certiport"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Certificate Name</label>
                <input
                  className="admin-input"
                  value={cert.title}
                  onChange={(e) => {
                    const list = [...certificates];
                    list[idx] = { ...cert, title: e.target.value };
                    onChangeCert(list);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 8. Sections & Navigation Editor
// ----------------------------------------------------------------------
function SectionsEditor({
  sections,
  onChange,
}: {
  sections: Content["sections"];
  onChange: (s: Content["sections"]) => void;
}) {
  const keys = Object.keys(sections) as Array<keyof Content["sections"]>;

  function updateSec(
    key: keyof Content["sections"],
    data: Content["sections"][keyof Content["sections"]]
  ) {
    onChange({ ...sections, [key]: data });
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h2>Sections & Navigation Visibility</h2>
        <p>
          Control which sections are visible on the homepage, along with their
          kicker labels and menu items.
        </p>
      </div>

      <div className="admin-grid-2">
        {keys.map((k) => {
          const item = sections[k];
          return (
            <div key={k} className="admin-item-box">
              <div className="admin-item-topbar">
                <span
                  className="admin-item-title"
                  style={{ textTransform: "capitalize" }}
                >
                  {k} Section
                </span>
                <label className="admin-toggle-switch">
                  <div className={`admin-switch-track ${item.visible ? "on" : ""}`}>
                    <div className="admin-switch-thumb" />
                  </div>
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    checked={item.visible}
                    onChange={(e) =>
                      updateSec(k, { ...item, visible: e.target.checked })
                    }
                  />
                  <span style={{ fontSize: "12px", fontFamily: "var(--mono)" }}>
                    {item.visible ? "Visible" : "Hidden"}
                  </span>
                </label>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Section Kicker Label</label>
                <input
                  className="admin-input"
                  value={item.label}
                  onChange={(e) =>
                    updateSec(k, { ...item, label: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Heading (H2)</label>
                <input
                  className="admin-input"
                  value={item.heading}
                  onChange={(e) =>
                    updateSec(k, { ...item, heading: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Header Menu Label</label>
                <input
                  className="admin-input"
                  value={item.menuLabel}
                  onChange={(e) =>
                    updateSec(k, { ...item, menuLabel: e.target.value })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 9. Contact Details Editor
// ----------------------------------------------------------------------
function ContactEditor({
  contact,
  email,
  onChange,
}: {
  contact: Content["contact"];
  email: string;
  onChange: (c: Content["contact"]) => void;
}) {
  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h2>Contact Section</h2>
        <p>
          Configure the call-to-action text displayed at the bottom of the
          portfolio.
        </p>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Contact Heading</label>
        <input
          className="admin-input"
          value={contact.heading}
          onChange={(e) => onChange({ ...contact, heading: e.target.value })}
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Highlighted Accent Text</label>
        <input
          className="admin-input"
          value={contact.highlight}
          onChange={(e) => onChange({ ...contact, highlight: e.target.value })}
        />
        <span className="admin-help">
          Renders in accent color (e.g. &quot;Let’s build it.&quot;).
        </span>
      </div>

      <div className="admin-item-box" style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "14px", color: "var(--muted)" }}>
          Contact recipient address: <strong>{email}</strong>
          <br />
          To update your email or social accounts (GitHub, LinkedIn), visit the{" "}
          <strong>Profile & Bio</strong> tab.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 10. Site & Brand Settings Editor
// ----------------------------------------------------------------------
function SiteEditor({
  site,
  onChange,
  onUpload,
}: {
  site: Content["site"];
  onChange: (s: Content["site"]) => void;
  onUpload: (cb: (url: string) => void) => void;
}) {
  function set<K extends keyof Content["site"]>(k: K, v: Content["site"][K]) {
    onChange({ ...site, [k]: v });
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h2>Site Settings & SEO Metadata</h2>
        <p>Brand naming, footer copyright, accents, and SEO cards.</p>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Brand Name</label>
          <input
            className="admin-input"
            value={site.brand}
            onChange={(e) => set("brand", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Brand Suffix</label>
          <input
            className="admin-input"
            value={site.brandSuffix}
            onChange={(e) => set("brandSuffix", e.target.value)}
            placeholder=".tv"
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">SEO Page Title</label>
        <input
          className="admin-input"
          value={site.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">SEO Meta Description</label>
        <textarea
          className="admin-textarea"
          value={site.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Archive Page Title</label>
          <input
            className="admin-input"
            value={site.archiveTitle}
            onChange={(e) => set("archiveTitle", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Archive Strip Label</label>
          <input
            className="admin-input"
            value={site.archiveLabel}
            onChange={(e) => set("archiveLabel", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Footer Copyright Notice</label>
          <input
            className="admin-input"
            value={site.footer}
            onChange={(e) => set("footer", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Top CTA Button Label</label>
          <input
            className="admin-input"
            value={site.contactButton}
            onChange={(e) => set("contactButton", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Dark Theme Accent Hex</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="color"
              className="admin-color-swatch"
              value={site.accentDark}
              onChange={(e) => set("accentDark", e.target.value)}
            />
            <input
              className="admin-input"
              value={site.accentDark}
              onChange={(e) => set("accentDark", e.target.value)}
            />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Light Theme Accent Hex</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="color"
              className="admin-color-swatch"
              value={site.accentLight}
              onChange={(e) => set("accentLight", e.target.value)}
            />
            <input
              className="admin-input"
              value={site.accentLight}
              onChange={(e) => set("accentLight", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Social Share Image (OpenGraph)</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            className="admin-input"
            value={site.socialImage}
            onChange={(e) => set("socialImage", e.target.value)}
          />
          <button
            onClick={() => onUpload((url) => set("socialImage", url))}
            className="admin-icon-btn"
            title="Upload social image"
          >
            <Upload size={16} />
          </button>
        </div>
        {site.socialImage && (
          <div className="admin-image-preview-box">
            <img
              src={site.socialImage}
              alt="Social card preview"
              className="admin-thumb"
              style={{ width: "90px", height: "48px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Reusable Tag / Chips Input Component
// ----------------------------------------------------------------------
function ChipsManager({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [inputVal, setInputVal] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputVal.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInputVal("");
      }
    }
  }

  function removeTag(tagToRemove: string) {
    onChange(tags.filter((t) => t !== tagToRemove));
  }

  return (
    <div className="admin-tags-wrap">
      {tags.map((t) => (
        <span key={t} className="admin-tag">
          {t}
          <button
            type="button"
            className="admin-tag-remove"
            onClick={() => removeTag(t)}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        className="admin-tag-input"
        placeholder="Type tag & press Enter..."
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
