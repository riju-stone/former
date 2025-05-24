import dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { dot } from 'node:test/reporters';

dotenv.config();

const sqlClient = neon(process.env.DATABASE_URL! );
export const db = drizzle({ client: sqlClient });