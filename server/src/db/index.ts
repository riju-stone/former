import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env.js";
import * as schema from "./schema/index";

const sql = neon(env.POSTGRES_URL);
export const db = drizzle({ client: sql, schema: schema });
