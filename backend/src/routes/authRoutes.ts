import { Router } from 'express';
import { signup, login, sendOtp, verifyOtp, guestLogin, getProfile } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/guest', guestLogin);
router.get('/profile', getProfile);

export default router;
