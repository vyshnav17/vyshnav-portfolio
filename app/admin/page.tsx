import type { Metadata } from "next";
import { readPortfolio } from "@/lib/content";
import { ownerRequest } from "@/lib/owner";
import AdminEditor from "./AdminEditor";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — Portfolio Content Manager",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const { content, version } = await readPortfolio();
  const isOwner = await ownerRequest();

  return (
    <main id="main" className="admin-page-container">
      <AdminEditor
        initialContent={content}
        initialVersion={version}
        isInitialOwner={isOwner}
      />
    </main>
  );
}

