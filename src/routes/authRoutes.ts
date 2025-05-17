import { Router } from 'express';
import authController from '../controllers/authController';
import sanitize from '../middlewares/sanitize';
import {
  changeMyPasswordValidationSchema,
  resendOtpValidationSchema,
  updateMeValidationSchema,
  userLoginValidationSchema,
  userRegisterValidationSchema,
  verifyOtpValidationSchema,
} from '../validations/authValidation';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post(
  '/register',
  sanitize(userRegisterValidationSchema),
  authController.register
);

router.post(
  '/login',
  sanitize(userLoginValidationSchema),
  authController.login
);

router.post(
  '/verify-otp',
  sanitize(verifyOtpValidationSchema),
  authController.verifyOtp
);

router.post(
  '/resend-otp',
  sanitize(resendOtpValidationSchema),
  authController.resendOtp
);

router.get(
  '/get-me',
  authenticate,
  authController.getMe,
  authController.getUser
);

router.put(
  '/update-me',
  sanitize(updateMeValidationSchema),
  authenticate,
  authController.updateMe
);

router.put(
  '/change-my-password',
  sanitize(changeMyPasswordValidationSchema),
  authenticate,
  authController.changeMyPassword
);

export default router;
