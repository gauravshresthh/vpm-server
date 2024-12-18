import { Router } from 'express';
import userController from '../controllers/userController';

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
router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;
