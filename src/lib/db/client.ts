export type DbClient = {
  query<T>(statement: string, params?: unknown[]): Promise<T[]>;
};

let cachedClient: DbClient | null = null;

export function createDbClient(): DbClient {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = {
    async query() {
      throw new Error("Direct SQL queries are not available in the local file-backed Labor Pulse store.");
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
