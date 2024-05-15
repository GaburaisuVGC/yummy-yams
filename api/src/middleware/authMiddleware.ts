// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: string;
}


interface AuthRequest extends Request {
    userId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token depuis le header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = (decoded as { userId: string }).userId; // Ajouter l'ID utilisateur décodé à la requête
        next();
    });
};

export default authMiddleware;
