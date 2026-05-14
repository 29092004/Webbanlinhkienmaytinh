import jwt from 'jsonwebtoken';

const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== 'string') {
        return null;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return null;
    }

    return token;
};

const authenticateToken = (req, res, next) => {
    try {
        const accessToken = extractBearerToken(req);

        if (!accessToken) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid or expired access token' });
        }

        next(error);
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
};

const requireAdmin = requireRole('admin');
const requireUser = requireRole('admin', 'user');

export {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireUser,
};
