import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

// Prefix all routes in this file with '/api'
router.use('/weather', weatherRoutes);

export default router;
