import type { Metadata } from "next";
import { Header, Footer, Cursor } from "@/components/Chrome";
import { siteUrl } from "@/data/site";
import "@fontsource-variable/geist";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vyshnav T V — Software Developer",
    template: "%s | Vyshnav T V",
  },
  description:
    "Full-stack development and applied AI projects by Vyshnav T V, a Computer Science Engineering student in Kannur, Kerala.",
  openGraph: {
    type: "website",
    siteName: "Vyshnav T V",
    title: "Vyshnav T V — Software Developer",
    description: "Selected work in full-stack engineering and applied AI.",
    images: ["/social-card.png"],
  },
  twitter: { card: "summary_large_image", images: ["/social-card.png"] },
};
export default function Layout({ children }: { children: React.ReactNode }) {
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
        <Header />
        {children}
        <Footer />
        <Cursor />
      </body>
    </html>
  );
}
