import { createApp } from "./app";
import { config } from "./config";

/**
 * Bootstrap the Express API server.
 * Runs on port 5000 (separate from Next.js on port 3000).
 */
async function startServer(): Promise<void> {
  const app = createApp();
  const PORT = config.port || 5000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🏠 HouseHunt API Server running on http://localhost:${PORT}`);
    console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`🔑 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`\nEnvironment: ${config.nodeEnv}\n`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
