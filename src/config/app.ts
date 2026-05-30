export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Client Analytics Portal",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "local"
};
