import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bajja backend API endpoints",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:6000" }],
    tags: [
      {
        name: "Auth",
        description: "Authentication related routes",
      },
      // Add more tags here as needed
    ],
  },
  apis: ["./src/routes/auth/*.js"], // Adjust the path as needed
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
