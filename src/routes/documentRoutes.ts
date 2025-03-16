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
  // authorize(['system-admin', 'editor']), // Add roles according to your needs
  // checkPermissions('document-management', 'create'),
  sanitize(createDocumentValidationSchema),
  documentController.create
);

// Get all documents
router.get(
  '/',
  authenticate,
  // authorize(['system-admin', 'editor', 'viewer']), // Add roles as needed
  // checkPermissions('document-management', 'read'),
  documentController.findAll
);

router.get(
  '/my-documents',
  authenticate,
  // authorize(['system-admin', 'editor', 'viewer']), // Add roles as needed
  // checkPermissions('document-management', 'read'),
  documentController.findMyDocuments
);

// Get a single document by ID
router.get(
  '/:id',
  authenticate,
  // authorize(['system-admin', 'editor', 'viewer']),
  // checkPermissions('document-management', 'read'),
  documentController.findById
);

// Get documents by parent ID (for folders)
router.get(
  '/parent/:parentId',
  authenticate,
  authorize(['system-admin', 'editor']),
  checkPermissions('document-management', 'read'),
  documentController.findByParentId
);

// Update a document by ID
router.put(
  '/:id',
  authenticate,
  // authorize(['system-admin', 'editor']),
  // checkPermissions('document-management', 'update'),
  sanitize(updateDocumentValidationSchema),
  documentController.updateById
);

// Delete a document by ID
router.delete(
  '/:id',
  authenticate,
  // authorize(['system-admin']),
  // checkPermissions('document-management', 'update'),
  documentController.deleteById
);

// Add a version to a document
router.post(
  '/:id/version',
  authenticate,
  authorize(['system-admin', 'editor']),
  checkPermissions('document-management', 'update'),
  documentController.addVersion
);

// Remove a version from a document
router.delete(
  '/:id/version/:versionId',
  authenticate,
  authorize(['system-admin', 'editor']),
  checkPermissions('document-management', 'delete'),
  documentController.removeVersion
);

// Set a specific version as the current version
router.put(
  '/:id/version/:versionId/current',
  authenticate,
  authorize(['system-admin', 'editor']),
  checkPermissions('document-management', 'update'),
  documentController.setCurrentVersion
);

export default router;
