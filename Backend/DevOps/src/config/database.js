// Import necessary modules
import 'dotenv/config.js';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

// Create a Neon sql using the database URL from environment variables
const sql = neon(process.env.DATABASE_URL);

// Initialize Drizzle ORM with the Neon sql instance
const db = drizzle(sql);

// Export the database instance for use in other parts of the application
export default { db, sql };
