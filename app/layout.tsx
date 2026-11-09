import type { Metadata } from "next";
import { Header, Footer, Cursor } from "@/components/Chrome";
import { siteUrl } from "@/data/site";
import { getContent } from "@/lib/content";
import { ownerRequest } from "@/lib/owner";
import "@fontsource-variable/geist";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.title,
      template: `%s | ${site.brand}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      siteName: site.brand,
      title: site.title,
      description: site.description,
      images: [site.socialImage],
    },
    twitter: { card: "summary_large_image", images: [site.socialImage] },
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const owner = await ownerRequest();
  const navigation = Object.entries(content.sections)
    .filter(([_, s]) => s.visible)
    .map(([id, s]) => [id, s.menuLabel]);
  const showContact = content.sections.contact.visible;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='light'?'light':'dark'}catch{}",
          }}
        />
      </head>
      <body id="top">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header navigation={navigation} site={content.site} showContact={showContact} />
        {children}
        <Footer footer={content.site.footer} owner={owner} />
        <Cursor />
      </body>
    </html>
  );
}
