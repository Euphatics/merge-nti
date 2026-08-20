import { Router } from 'express';
import { getGalleryImages } from '../controllers/gallery.controller.js';

const router = Router();

// Public endpoint to get gallery images
router.get('/', getGalleryImages);

export default router;
