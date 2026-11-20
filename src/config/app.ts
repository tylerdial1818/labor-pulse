// The canonical public address. Production always uses it, so citations,
// social previews and metadata never point at a vercel.app host.
export const PRODUCTION_URL = "https://laborpulse.org";

export function resolveAppUrl(env: Record<string, string | undefined>) {
  if ((env.NEXT_PUBLIC_VERCEL_ENV ?? env.VERCEL_ENV) === "production") {
    return PRODUCTION_URL;
  }
  return env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Labor Pulse",
  // Direct process.env reads so Next.js can inline them in client bundles.
  url: resolveAppUrl({
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  }),
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "local",
  firmName: "Dialed Intelligence LLC",
  firmUrl: "https://www.dialedintelligence.com/",
  researchEmail: "tyler@dialedintelligence.com"
};
