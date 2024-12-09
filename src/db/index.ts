import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sqlClient = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle({ client: sqlClient });
