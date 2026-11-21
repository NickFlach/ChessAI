import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL;

// Neon's serverless driver speaks WebSockets to Neon's proxy and cannot reach a
// plain Postgres server. A self-hosted database on the same machine uses node-postgres.
const isLocal = !!url && /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);

export const pool = !url
  ? (null as any)
  : isLocal
    ? new pg.Pool({ connectionString: url })
    : new NeonPool({ connectionString: url });

export const db = !url
  ? (null as any)
  : isLocal
    ? drizzlePg(pool as any, { schema })
    : drizzleNeon({ client: pool as any, schema });
