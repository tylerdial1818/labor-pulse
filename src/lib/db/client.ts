export type DbClient = {
  query<T>(statement: string, params?: unknown[]): Promise<T[]>;
};

export function createDbClient(): DbClient {
  // TODO: Replace with Prisma, Drizzle, Kysely, or a service API client once the app has a real data source.
  return {
    async query() {
      throw new Error("Database client is not configured. Set DATABASE_URL and implement src/lib/db/client.ts.");
    }
  };
}
