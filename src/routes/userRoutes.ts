/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import userController from '../controllers/userController';
import sanitize from '../middlewares/sanitize';
import {
  userLoginValidationSchema,
  userRegisterValidationSchema,
} from '../validations/userValidation';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Get all users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                     example: 612c48f1d3a9e5509cbacb8f
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                     example: John Doe
 */
router.post(
  '/register',
  sanitize(userRegisterValidationSchema),
  userController.register
);

router.post(
  '/login',
  sanitize(userLoginValidationSchema),
  userController.login
);

export default router;
