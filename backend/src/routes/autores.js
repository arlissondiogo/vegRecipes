import { Router } from "express";
import { autorController } from "../controllers/autorController.js";

const router = Router();

router.get("/", autorController.listarTodos);
router.get("/:id", autorController.buscarPorId);
router.post("/", autorController.criar);
router.put("/:id", autorController.atualizar);
router.delete("/:id", autorController.remover);

export default router;
