import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import checkPermissions from '../middlewares/checkPermissions';
import {
  createDocumentCategoryValidationSchema,
  updateDocumentCategoryValidationSchema,
} from '../validations/documentCategoryValidation';
import sanitize from '../middlewares/sanitize';
import documentCategoryController from '../controllers/documentCategoryContoller';

const router = Router();

// Create a new document category
router.post(
  '/',
  authenticate,
  authorize(['system-admin', 'editor']),
  checkPermissions('document-management', 'create'),
  sanitize(createDocumentCategoryValidationSchema),
  documentCategoryController.create
);

// Get all document categories
router.get(
  '/',
  authenticate,
  authorize(['system-admin', 'editor', 'viewer']),
  checkPermissions('document-management', 'read'),
  documentCategoryController.findAll
);

// Get a document category by ID
router.get(
  '/:id',
  authenticate,
  authorize(['system-admin', 'editor', 'viewer']),
  checkPermissions('document-management', 'read'),
  documentCategoryController.findById
);

// Update a document category by ID
router.put(
  '/:id',
  authenticate,
  authorize(['system-admin', 'editor']),
  checkPermissions('document-management', 'update'),
  sanitize(updateDocumentCategoryValidationSchema),
  documentCategoryController.updateById
);

// Delete a document category by ID
router.delete(
  '/:id',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('document-management', 'delete'),
  documentCategoryController.deleteById
);

export default router;
