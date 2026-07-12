import app from "./app.js";
import { initializeDatabase } from "./db.js";

const PORT = process.env.PORT || 3000;

initializeDatabase();

app.listen(PORT, () => {
  console.log(`VegRecipes rodando em http://localhost:${PORT}`);
});
