import { neon } from "@neondatabase/serverless";

export type DbClient = {
  query<T>(statement: string, params?: unknown[]): Promise<T[]>;
};

let cachedClient: DbClient | null = null;

export function createDbClient(): DbClient {
  if (cachedClient) {
    return cachedClient;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    cachedClient = {
      async query() {
        throw new Error("Direct SQL queries require DATABASE_URL. The local file-backed Labor Pulse store is active.");
      }
    };

    return cachedClient;
  }

  const sql = neon(databaseUrl);

  cachedClient = {
    async query<T>(statement: string, params: unknown[] = []) {
      return (await sql.query(statement, params)) as T[];
    }
  };

  return cachedClient;
}

export function createUnavailableDbClient(message: string): DbClient {
  return {
    async query() {
      throw new Error(message);
    }
  };
}
