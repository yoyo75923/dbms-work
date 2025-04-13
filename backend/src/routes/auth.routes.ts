import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { UserRole } from '../types/user.types';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
    user_id: string;
    email: string;
    name: string;
    role: UserRole;
    roll_number: string;
    wing_name: string;
}

interface RoleDetailsRow extends RowDataPacket {
    user_id: string;
    [key: string]: any;
}

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user from database
        const [userResult] = await pool.query<UserRow[]>(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );

        const user = userResult[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if password matches (in this case, it should match the user's name as per requirements)
        if (password !== user.name) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, role: user.role, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        // Get additional user details based on role
        let additionalDetails = {};
        
        switch (user.role) {
            case UserRole.VOLUNTEER:
                const [volunteerResult] = await pool.query<RoleDetailsRow[]>(
                    'SELECT * FROM volunteer WHERE user_id = ?',
                    [user.user_id]
                );
                additionalDetails = volunteerResult[0] || {};
                break;
            case UserRole.MENTOR:
                const [mentorResult] = await pool.query<RoleDetailsRow[]>(
                    'SELECT * FROM mentor WHERE user_id = ?',
                    [user.user_id]
                );
                additionalDetails = mentorResult[0] || {};
                break;
            case UserRole.GEN_SEC:
                const [genSecResult] = await pool.query<RoleDetailsRow[]>(
                    'SELECT * FROM gen_sec WHERE user_id = ?',
                    [user.user_id]
                );
                additionalDetails = genSecResult[0] || {};
                break;
        }

        res.json({
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                rollNumber: user.roll_number,
                wingName: user.wing_name,
                ...additionalDetails
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 