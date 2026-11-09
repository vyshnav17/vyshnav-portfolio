"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  Moon,
  Sun,
  X,
  ArrowUp,
  Check,
  Copy,
} from "lucide-react";
import type {Content} from "@/data/schema";

export function Mark() {
  return (
    <svg aria-hidden="true" className="mark" viewBox="0 0 34 34">
      <rect width="34" height="34" rx="7" fill="#b6ff69" />
      <path d="M6 9.5h5.5l4.8 11 4.8-11h5.6L18 27h-3.7z" fill="#131812" />
      <path d="M22 25.8h5.2l2.1-4.5h-5.2z" fill="#131812" />
    </svg>
  );
}
export function Header({navigation,site,showContact}:{navigation:string[][];site:Content["site"];showContact:boolean}) {
  const path = usePathname(),
    [theme, setTheme] = useState("dark"),
    [menu, setMenu] = useState(false),
    [active, setActive] = useState("");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
  }, []);
  useEffect(() => {
    setMenu(false);
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--progress",
        String(max ? scrollY / max : 0),
      );
      let current = path.startsWith("/work/") ? "work" : "";
      for (const [id] of navigation) {
        const n = document.getElementById(id);
        if (n && n.getBoundingClientRect().top <= innerHeight * 0.34)
          current = id;
      }
      setActive(current);
    };
    const scroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    return () => {
      removeEventListener("scroll", scroll);
      removeEventListener("resize", scroll);
    };
  }, [path,navigation]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [menu]);

  if (path.startsWith("/admin")) return null;
  function toggle() {
    const t = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    setTheme(t);
    try {
      localStorage.setItem("portfolio-theme", t);
    } catch {}
  }
  return (
    <header className="header">
      <div className="progress" />
      <div className="container header-inner">
        <a
          href="/"
          className="brand"
          aria-label="Portfolio home"
          onClick={() => setMenu(false)}
        >
          <Mark />
          <span>
            {site.brand}<span className="muted">{site.brandSuffix}</span>
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menu ? "nav open" : "nav"}
          id="navigation"
        >
          {navigation.map(([id, text]) => (
            <a
              href={"/#" + id}
              key={id}
              aria-current={active === id ? "location" : undefined}
              className={active === id ? "active" : ""}
              onClick={() => setMenu(false)}
            >
              {text}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme"
            onClick={toggle}
            aria-label={
              "Switch to " + (theme === "dark" ? "light" : "dark") + " theme"
            }
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {showContact&&<a href="/#contact" className="talk" onClick={() => setMenu(false)}>
            {site.contactButton} <ArrowUpRight size={15} />
          </a>}
          <button
            className="menu-button"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-controls="navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function CopyEmail({email}:{email:string}) {
  const [state, setState] = useState("");
  useEffect(() => {
    if (!state) return;
    const t = setTimeout(() => setState(""), 2600);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <button
      className="copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setState("Email copied");
        } catch {
          setState("Select the address to copy");
        }
      }}
      aria-label="Copy email address"
    >
      {state === "Email copied" ? <Check size={16} /> : <Copy size={16} />}
      <span aria-live="polite">{state}</span>
    </button>
  );
}
export function Footer({footer,owner}:{footer:string;owner:boolean}) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer>
      <div className="container footer-inner">
        <span>{footer}</span>
        <a href="/admin/" style={{ fontSize: "13px", opacity: 0.65 }}>
          {owner ? "Edit portfolio" : "Admin"}
        </a>
        <a href="#top">
          Back to top <ArrowUp size={14} />
        </a>
      </div>
    </footer>
  );
}
export function Cursor() {
  useEffect(() => {
    if (
      !matchMedia(
        "(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
      ).matches
    )
      return;
    const dot = document.createElement("div");
    dot.className = "cursor-ring";
    document.body.appendChild(dot);
    const move = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      dot.style.transform =
        "translate(" + e.clientX + "px," + e.clientY + "px)";
      dot.style.opacity = target.closest("a,button") ? ".7" : "0";
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      dot.remove();
      document.removeEventListener("pointermove", move);
    };
  }, []);
  return null;
}
