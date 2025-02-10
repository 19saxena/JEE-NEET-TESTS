import express from 'express';
import { storeTestResults, getTestResults } from '../controllers/testController.js';
import protect from '../../middleware/authMiddleware.js'; // Middleware to verify JWT

const router = express.Router();

router.post('/store', protect, storeTestResults); // Endpoint to store test results
router.get('/results', protect, getTestResults); // Endpoint to retrieve test results

export default router;
