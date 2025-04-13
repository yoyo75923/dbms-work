import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import pool from '../config/database';
import { UserRole } from '../types/user.types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface GalleryRow extends RowDataPacket {
    gallery_id: number;
    event_name: string;
    created_by_name: string;
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Create a new gallery
router.post('/', authenticateToken, authorizeRoles(UserRole.MENTOR, UserRole.GEN_SEC), async (req: any, res) => {
    try {
        const { eventId, title } = req.body;
        const createdBy = req.user.userId;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO galleries (event_id, title, created_by) VALUES (?, ?, ?)',
            [eventId, title, createdBy]
        );

        res.json({
            message: 'Gallery created successfully',
            galleryId: result.insertId
        });
    } catch (error) {
        console.error('Error creating gallery:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Upload media to gallery
router.post('/upload/:galleryId', authenticateToken, authorizeRoles(UserRole.MENTOR, UserRole.GEN_SEC), 
    upload.array('media', 10), async (req: any, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { galleryId } = req.params;
        const uploadedBy = req.user.userId;
        const files = req.files as Express.Multer.File[];
        const { descriptions } = req.body;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const mediaType = file.mimetype.startsWith('image/') ? 'photo' : 'video';
            const description = descriptions ? JSON.parse(descriptions)[i] : null;

            await connection.query(
                `INSERT INTO media 
                (gallery_id, uploaded_by, media_type, file_path, description)
                VALUES (?, ?, ?, ?, ?)`,
                [galleryId, uploadedBy, mediaType, file.filename, description]
            );
        }

        await connection.commit();
        res.json({ message: 'Media uploaded successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error uploading media:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
});

// Get gallery with media details
router.get('/:galleryId', authenticateToken, async (req, res) => {
    try {
        const [gallery] = await pool.query<GalleryRow[]>(
            `SELECT 
                g.*,
                e.event_name,
                u.name as created_by_name
             FROM galleries g
             JOIN events e ON g.event_id = e.event_id
             JOIN users u ON g.created_by = u.user_id
             WHERE g.gallery_id = ?`,
            [req.params.galleryId]
        );

        const [media] = await pool.query<RowDataPacket[]>(
            `SELECT 
                m.*,
                u.name as uploaded_by_name
             FROM media m
             JOIN users u ON m.uploaded_by = u.user_id
             WHERE m.gallery_id = ?
             ORDER BY m.upload_date DESC`,
            [req.params.galleryId]
        );

        res.json({
            gallery: gallery[0] || null,
            media
        });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all galleries for an event
router.get('/event/:eventId', authenticateToken, async (req, res) => {
    try {
        const [galleries] = await pool.query(
            `SELECT 
                g.*,
                u.name as created_by_name,
                COUNT(m.media_id) as media_count
             FROM galleries g
             JOIN users u ON g.created_by = u.user_id
             LEFT JOIN media m ON g.gallery_id = m.gallery_id
             WHERE g.event_id = ?
             GROUP BY g.gallery_id
             ORDER BY g.created_at DESC`,
            [req.params.eventId]
        );
        res.json(galleries);
    } catch (error) {
        console.error('Error fetching galleries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 