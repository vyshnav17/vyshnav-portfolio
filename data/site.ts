export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  "https://vyshnav-tv-engineering-portfolio.olivefancy1.chatgpt.site"
).replace(/\/$/, "");
