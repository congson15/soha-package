import express from 'express';
import { getSubjectByName } from '../controllers/subjects.controller';
const router = express.Router();
router.get('/', getSubjectByName);

export default router;
