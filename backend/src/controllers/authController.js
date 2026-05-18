import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import accountModel from '../models/accountModel.js';
import customerModel from '../models/customerModel.js';
import db from '../config/mysql.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ALLOWED_ROLES = ['admin', 'user'];
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 5);
const otpStore = new Map();

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sanitizeUser = (user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const storeOtp = async (email, otp) => {
    const otpHash = await bcrypt.hash(otp, 10);

    otpStore.set(email, {
        otpHash,
        expiresAt: Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000,
    });
};

const verifyStoredOtp = async (email, otp) => {
    const otpRecord = otpStore.get(email);

    if (!otpRecord) {
        return { valid: false, message: 'OTP not found or has not been sent' };
    }

    if (Date.now() > otpRecord.expiresAt) {
        otpStore.delete(email);
        return { valid: false, message: 'OTP has expired' };
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isMatch) {
        return { valid: false, message: 'OTP is invalid' };
    }

    otpStore.delete(email);
    return { valid: true };
};

const buildAccessToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

const buildRefreshToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            role: user.role,
            tokenVersion: 1,
        },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const issueAuthResponse = async (res, user, extraData = {}) => {
    const safeUser = sanitizeUser(user);
    const accessToken = buildAccessToken(user);
    const refreshToken = buildRefreshToken(user);

    await accountModel.updateRefreshToken(user.id, refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
        success: true,
        accessToken,
        refreshToken,
        user: safeUser,
        ...extraData,
    });
};

const authController = {
    sendRegisterOtp: async (req, res, next) => {
        try {
            const username = req.body.username?.trim().toLowerCase();

            if (!username) {
                return res.status(400).json({ message: 'Username (email) is required' });
            }

            if (!isValidEmail(username)) {
                return res.status(400).json({ message: 'Username must be a valid email address' });
            }

            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                return res.status(500).json({ message: 'Email service is not configured' });
            }

            const existingUser = await accountModel.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const otp = generateOtpCode();
            await storeOtp(username, otp);

            await emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: username,
                subject: 'Ma OTP dang ky tai khoan',
                text: `Ma OTP cua ban la ${otp}. Ma co hieu luc trong ${OTP_EXPIRES_MINUTES} phut.`,
                html: `<p>Ma OTP cua ban la <b>${otp}</b>.</p><p>Ma co hieu luc trong ${OTP_EXPIRES_MINUTES} phut.</p>`,
            });

            return res.json({
                success: true,
                message: 'OTP has been sent to your email',
                expiresInMinutes: OTP_EXPIRES_MINUTES,
            });
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            const username = req.body.username?.trim().toLowerCase();
            const password = req.body.password;
            const role = req.body.role || 'user';
            const otp = req.body.otp;
            const phone = req.body.phone ?? '';

            if (!username || !password || !otp) {
                return res.status(400).json({ message: 'Username, password and otp are required' });
            }

            if (!ALLOWED_ROLES.includes(role)) {
                return res.status(400).json({ message: 'Role must be admin or user' });
            }

            if (role !== 'user') {
                return res.status(403).json({ message: 'Public register can only create user accounts' });
            }

            if (!isValidEmail(username)) {
                return res.status(400).json({ message: 'Username must be a valid email address' });
            }

            const existingUser = await accountModel.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const otpValidation = await verifyStoredOtp(username, otp);
            if (!otpValidation.valid) {
                return res.status(400).json({ message: otpValidation.message });
            }

            const connection = await db.getConnection();

            const hashedPassword = await bcrypt.hash(password, 10);
            let accountId;
            let customerId;

            try {
                await connection.beginTransaction();

                accountId = await accountModel.create(
                    username,
                    hashedPassword,
                    role,
                    null,
                    connection
                );

                const refreshToken = buildRefreshToken({ id: accountId, role });
                await accountModel.updateRefreshToken(accountId, refreshToken, connection);

                customerId = await customerModel.create(
                    accountId,
                    '',
                    '',
                    username,
                    phone,
                    '',
                    connection
                );

                await connection.commit();
            } catch (transactionError) {
                await connection.rollback();
                throw transactionError;
            } finally {
                connection.release();
            }

            res.status(201).json({ success: true, accountId, customerId });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const username = req.body.username;
            const password = req.body.password;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const user = await accountModel.findByUsername(username);
            if (!user) {
                return res.status(404).json({ message: 'Account not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Wrong password' });
            }

            return issueAuthResponse(res, user);
        } catch (error) {
            next(error);
        }
    },

    googleLogin: async (req, res, next) => {
        try {
            const { idToken } = req.body;

            if (!process.env.GOOGLE_CLIENT_ID) {
                return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
            }

            if (!idToken) {
                return res.status(400).json({ message: 'Google idToken is required' });
            }

            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload?.email) {
                return res.status(400).json({ message: 'Google account email not found' });
            }

            let user = await accountModel.findByUsername(payload.email);
            let isNewUser = false;

            if (!user) {
                const randomPassword = crypto.randomBytes(32).toString('hex');
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                const accountId = await accountModel.create(payload.email, hashedPassword, 'user', null);
                const refreshToken = buildRefreshToken({
                    id: accountId,
                    role: 'user',
                });

                await accountModel.updateRefreshToken(accountId, refreshToken);
                user = await accountModel.findByUsername(payload.email);
                isNewUser = true;
            }

            const existingCustomer = await (async () => {
                return db.query(
                    'SELECT customer_id FROM customer WHERE customer_id = ? LIMIT 1',
                    [user.id]
                );
            })();

            if (!existingCustomer[0]?.length) {
                await customerModel.create(
                    user.id,
                    '',
                    '',
                    payload.email,
                    '',
                    ''
                );
            }

            return await issueAuthResponse(res, user, {
                isNewUser,
                googleProfile: {
                    email: payload.email,
                    name: payload.name || '',
                    picture: payload.picture || '',
                },
            });
        } catch (error) {
            if (error.message?.toLowerCase().includes('token')) {
                return res.status(401).json({ message: 'Invalid Google token' });
            }

            next(error);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is required' });
            }

            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            );

            const user = await accountModel.getById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'Account not found' });
            }

            if (await accountModel.supportsRefreshToken() && user.refresh_token !== refreshToken) {
                return res.status(401).json({ message: 'Refresh token does not match current session' });
            }

            return await issueAuthResponse(res, user);
        } catch (error) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid or expired refresh token' });
            }

            next(error);
        }
    },

    me: async (req, res) => {
        return res.json({
            success: true,
            user: req.user,
        });
    },

    logout: async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

            if (refreshToken) {
                try {
                    const decoded = jwt.verify(
                        refreshToken,
                        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
                    );

                    await accountModel.clearRefreshToken(decoded.id);
                } catch {
                    // Clear cookie even if token verification fails.
                }
            }

            res.clearCookie('refreshToken');
            res.json({ success: true, message: 'Logout success' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default authController;
