import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utils/swagger.js";
const router = express.Router();

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css',
  })
);

export default router;
