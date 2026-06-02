import { Router } from "express";
import { receitaController } from "../controllers/receitaController.js";

const router = Router();

router.get("/", receitaController.listarTodas);
router.get("/:id", receitaController.buscarPorId);
router.post("/", receitaController.criar);
router.put("/:id", receitaController.atualizar);
router.delete("/:id", receitaController.remover);

export default router;
