import express from "express";
import {
    getArsip,
    getArsipById,
    createArsip,
    updateArsip,
    deleteArsip
} from "../controllers/ArsipController.js";

const router = express.Router();

router.get('/arsip', getArsip);
router.get('/arsip/:idArsip', getArsipById);
router.post('/arsip', createArsip);
router.patch('/arsip/:idArsip', updateArsip);
router.delete('/arsip/:idArsip', deleteArsip);

export default router;