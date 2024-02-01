import express from "express";
import {
    getData,
    getDataById,
    createData,
    updateData,
    deleteData
} from "../controllers/DataController.js";

const router = express.Router();

router.get('/data', getData);
router.get('/data/:idData', getDataById);
router.post('/data', createData);
router.patch('/data/:idData', updateData);
router.delete('/data/:idData', deleteData);

export default router;