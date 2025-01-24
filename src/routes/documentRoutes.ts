import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import sanitize from '../middlewares/sanitize';
import checkPermissions from '../middlewares/checkPermissions';
import documentController from '../controllers/documentController';
import {
  createDocumentValidationSchema,
  updateDocumentValidationSchema,
} from '../validations/documentValidation';

const router = Router();

// Create a new document
router.post(
  '/',
  authenticate,
  authorize(['super-admin', 'editor']), // Add roles according to your needs
  checkPermissions('document-management', 'write'),
  sanitize(createDocumentValidationSchema),
  documentController.create
);

// Get all documents
router.get(
  '/',
  authenticate,
  authorize(['super-admin', 'editor', 'viewer']), // Add roles as needed
  checkPermissions('document-management', 'read'),
  documentController.findAll
);

// Get a single document by ID
router.get(
  '/:id',
  authenticate,
  authorize(['super-admin', 'editor', 'viewer']),
  checkPermissions('document-management', 'read'),
  documentController.findById
);

// Get documents by parent ID (for folders)
router.get(
  '/parent/:parentId',
  authenticate,
  authorize(['super-admin', 'editor']),
  checkPermissions('document-management', 'read'),
  documentController.findByParentId
);

// Update a document by ID
router.put(
  '/:id',
  authenticate,
  authorize(['super-admin', 'editor']),
  checkPermissions('document-management', 'write'),
  sanitize(updateDocumentValidationSchema),
  documentController.updateById
);

// Delete a document by ID
router.delete(
  '/:id',
  authenticate,
  authorize(['super-admin']),
  checkPermissions('document-management', 'write'),
  documentController.deleteById
);

// Add a version to a document
router.post(
  '/:id/version',
  authenticate,
  authorize(['super-admin', 'editor']),
  checkPermissions('document-management', 'write'),
  documentController.addVersion
);

// Remove a version from a document
router.delete(
  '/:id/version/:versionId',
  authenticate,
  authorize(['super-admin', 'editor']),
  checkPermissions('document-management', 'write'),
  documentController.removeVersion
);

// Set a specific version as the current version
router.put(
  '/:id/version/:versionId/current',
  authenticate,
  authorize(['super-admin', 'editor']),
  checkPermissions('document-management', 'write'),
  documentController.setCurrentVersion
);

export default router;
