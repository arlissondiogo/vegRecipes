import express from "express";
import receitasRouter from "./routes/receitas.js";
import categoriasRouter from "./routes/categorias.js";
import autoresRouter from "./routes/autores.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(logger);

app.use("/receitas", receitasRouter);
app.use("/categorias", categoriasRouter);
app.use("/autores", autoresRouter);

app.get("/", (req, res) => {
  res.json({
    api: "VegRecipes API",
    versao: "1.0.0",
    rotas: ["/receitas", "/categorias", "/autores"],
  });
});

app.use(errorHandler);

export default app;
