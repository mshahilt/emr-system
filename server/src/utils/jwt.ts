import jwt from 'jsonwebtoken';

export interface TokenPayload {
    id: string;
    email: string;
    role?: string;
}


const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRATION_TIME = '24h';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export const decodeToken = (token: string): null | { [key: string]: any } => {
    return jwt.decode(token) as { [key: string]: any } | null;
};