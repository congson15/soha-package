import express from 'express';
import { postLogin } from '../controllers/auth.controller';
import { check } from 'express-validator';

const router = express.Router();
const validateUsername = check('username', 'Username cannot be blank').notEmpty();
const validatePassword = check('password', 'Password cannot be blank').notEmpty();

router.post('/login', [validateUsername, validatePassword], postLogin);

export default router;
