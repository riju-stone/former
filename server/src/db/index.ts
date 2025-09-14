
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.POSTGRES_URL! || "postgresql://neondb_owner:Y3CaP4gApblh@ep-misty-mountain-a1hoeoth.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
export const db = drizzle({ client: sql });

