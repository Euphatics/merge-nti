import { Router } from 'express';
import { getResults } from '../controllers/admin.controller.js';
import { getPyqs } from '../controllers/pyq.controller.js';
import { getGalleryImages } from '../controllers/gallery.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { pyqQuery, resultsQuery } from '../validation/admin.schema.js';

/**
 * Read-only endpoints served to anonymous visitors.
 *
 * These previously lived in three separate route files mounted at overlapping
 * prefixes, which made the real URL of any given handler hard to determine.
 */
const publicRouter = Router();

publicRouter.get('/results', validate({ query: resultsQuery }), asyncHandler(getResults));
publicRouter.get('/pyqs', validate({ query: pyqQuery }), asyncHandler(getPyqs));
publicRouter.get('/gallery', asyncHandler(getGalleryImages));

export default publicRouter;
