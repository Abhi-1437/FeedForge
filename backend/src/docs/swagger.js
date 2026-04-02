import swaggerUi from "swagger-ui-express";

const docs = {
  openapi: "3.0.0",
  info: {
    title: "FeedForge API",
    version: "1.0.0",
    description: "FeedForge backend API documentation",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Feed: {
        type: "object",
        properties: {
          _id: { type: "string" },
          url: { type: "string" },
          title: { type: "string" },
          userId: { type: "string" },
          folderId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Article: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          content: { type: "string" },
          author: { type: "string" },
          link: { type: "string" },
          guid: { type: "string" },
          feedId: { type: "string" },
          folderId: { type: "string" },
          userId: { type: "string" },
          bookmarked: { type: "boolean" },
          read: { type: "boolean" },
          publishedAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Folder: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Registered", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "400": { description: "Bad request" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "Get current user",
        responses: {
          "200": { description: "Current user", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        },
      },
    },
    "/api/feeds": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "List user feeds",
        parameters: [{ name: "folderId", in: "query", schema: { type: "string" } }],
        responses: {
          "200": { description: "Feeds list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Feed" } } } } },
        },
      },
      post: {
        security: [{ bearerAuth: [] }],
        summary: "Create a feed",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  title: { type: "string" },
                  folderId: { type: "string" },
                },
                required: ["url"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Feed" } } } },
        },
      },
    },
    "/api/feeds/{id}": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "Get feed by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Feed", content: { "application/json": { schema: { $ref: "#/components/schemas/Feed" } } } },
        },
      },
      patch: {
        security: [{ bearerAuth: [] }],
        summary: "Update feed",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  title: { type: "string" },
                  folderId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated feed" },
        },
      },
      delete: {
        security: [{ bearerAuth: [] }],
        summary: "Delete feed",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Deleted feed" },
        },
      },
    },
    "/api/articles": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "List user articles",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "bookmarked", in: "query", schema: { type: "boolean" } },
          { name: "read", in: "query", schema: { type: "boolean" } },
          { name: "folderId", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
        ],
        responses: {
          "200": { description: "Articles list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Article" } } } } },
        },
      },
    },
    "/api/articles/search": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "Search articles",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Search results", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Article" } } } } },
        },
      },
    },
    "/api/articles/bookmarked": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "List bookmarked articles",
        responses: {
          "200": { description: "Bookmarked articles", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Article" } } } } },
        },
      },
    },
    "/api/articles/unread": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "List unread articles",
        responses: {
          "200": { description: "Unread articles", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Article" } } } } },
        },
      },
    },
    "/api/articles/{id}/bookmark": {
      patch: {
        security: [{ bearerAuth: [] }],
        summary: "Toggle bookmarked state",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bookmarked: { type: "boolean" },
                },
                required: ["bookmarked"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated article" },
        },
      },
    },
    "/api/articles/{id}/read": {
      patch: {
        security: [{ bearerAuth: [] }],
        summary: "Toggle read state",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  read: { type: "boolean" },
                },
                required: ["read"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated article" },
        },
      },
    },
    "/api/folders": {
      get: {
        security: [{ bearerAuth: [] }],
        summary: "List folders",
        responses: {
          "200": { description: "Folder list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Folder" } } } } },
        },
      },
      post: {
        security: [{ bearerAuth: [] }],
        summary: "Create a folder",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Created folder", content: { "application/json": { schema: { $ref: "#/components/schemas/Folder" } } } } },
        },
      },
    },
    "/api/summary": {
      post: {
        security: [{ bearerAuth: [] }],
        summary: "Generate a summary",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  url: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Summary generated", content: { "application/json": { schema: { type: "object", properties: { summary: { type: "string" } } } } } },
          "429": { description: "Rate limit exceeded" },
        },
      },
    },
  };

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
};