import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import sanitize from '../middlewares/sanitize';
import {
  acceptInvitationValidationSchema,
  invitationValidationSchema,
} from '../validations/invitationValidationSchema';
import invitationController from '../controllers/invitationController';

const router = Router();

router.post(
  '/invite',
  authenticate,
  authorize(['system-admin']),
  sanitize(invitationValidationSchema),
  invitationController.invite
);

router.post(
  '/accept-invite',
  sanitize(acceptInvitationValidationSchema),
  invitationController.acceptInvitation
);

export default router;
