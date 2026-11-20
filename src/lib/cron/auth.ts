// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` on every scheduled
// call. Without a configured secret the routes stay closed.
export function isCronAuthorized(request: Request, secret = process.env.CRON_SECRET) {
  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}
