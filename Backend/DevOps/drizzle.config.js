// Import environment variables from a .env file
import 'dotenv/config.js';

// Export Drizzle configuration
export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

// NOTE: This configuration file sets up Drizzle ORM to connect to a PostgreSQL database.
// It specifies the location of the schema files and the output directory for generated files.
// The database connection URL is securely retrieved from environment variables.
