import { Router } from 'express';
import integrationApiController from '../controllers/integrationApiController';
import sanitize from '../middlewares/sanitize';
import { integrationApiForStudentValidationSchema } from '../validations/integrationApiValidation';

const router = Router();

router.post(
  '/students',
  sanitize(integrationApiForStudentValidationSchema),
  integrationApiController.integrateStudent
);

export default router;
