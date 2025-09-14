
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '../env.js';

const sql = neon(env.POSTGRES_URL);
export const db = drizzle({ client: sql });

