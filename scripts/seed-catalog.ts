import { seedCatalog } from "../src/lib/db/queries";

async function main() {
  await seedCatalog();
  console.log("Labor Pulse indicator catalog seeded.");
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
