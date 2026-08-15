import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HouseHunt API",
      version: "1.0.0",
      description:
        "Real-estate listing platform API. Supports authentication (JWT), property CRUD, search with pagination, similar properties, and inquiry management with rate limiting.",
      contact: {
        name: "HouseHunt Team",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development API server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token (obtained from /api/auth/login)",
        },
      },
    },
    tags: [
      { name: "Auth", description: "User authentication — register, login, refresh, logout" },
      { name: "Listings", description: "Property listings — CRUD, search, filter, paginate" },
      { name: "Inquiries", description: "Lead/inquiry management — submit, list, update status" },
    ],
  },
  // Scan route files for @swagger JSDoc annotations
  apis: ["./server/routes/*.ts", "./server/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Mount Swagger UI at /api-docs.
 * Also exposes the raw spec at /api-docs/json.
 */
export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "HouseHunt API Documentation",
  }));

  // Raw JSON spec endpoint
  app.get("/api-docs/json", (_req, res) => {
    res.json(swaggerSpec);
  });

  console.log("📚 Swagger docs available at /api-docs");
}
