import * as Sentry from "@sentry/node";

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: "https://30a1b478d336e0ce51bd5add9b68901d@o4509695299944448.ingest.de.sentry.io/4509695312199760",
  integrations: [Sentry.mongooseIntegration()],
  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  // tracesSampleRate: 1.0,
});
