import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-mock-key';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, mobile, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { mobile: mobile || undefined }]
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'User with this email or mobile already exists' });
      return;
    }

    // Hash password (mock for now, normally use bcrypt)
    const passwordHash = Buffer.from(password).toString('base64');

    const user = await prisma.user.create({
      data: {
        fullName,
        mobile,
        email,
        passwordHash,
        role: 'trainee'
      }
    });

    res.status(201).json({ success: true, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findFirst({
      where: { email, role }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials or role' });
      return;
    }

    const passwordHash = Buffer.from(password).toString('base64');
    if (user.passwordHash !== passwordHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile } = req.body;

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.verificationToken.upsert({
      where: { mobile },
      update: { otp, expiresAt },
      create: { mobile, otp, expiresAt }
    });

    // In a real app, send OTP via SMS gateway
    console.log(`Mock sending OTP ${otp} to ${mobile}`);

    res.status(200).json({ success: true, message: `OTP sent to +91 ${mobile}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile, otp } = req.body;

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { mobile }
    });

    if (!tokenRecord || tokenRecord.otp !== otp || tokenRecord.expiresAt < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    // OTP is valid. Find or create user
    let user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: 'New User',
          mobile,
          passwordHash: '',
          role: 'trainee'
        }
      });
    }

    // Delete used OTP
    await prisma.verificationToken.delete({ where: { mobile } });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ success: true, token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const guestLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Return a mock token for guest
    const token = jwt.sign({ userId: 'guest', role: 'guest' }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token, role: 'trainee', guest: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming auth middleware attached user to req
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
