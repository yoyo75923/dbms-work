import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import pool from '../config/database';
import { UserRole } from '../types/user.types';

const router = express.Router();

// Get all volunteers under a mentor
router.get('/mentor-volunteers', authenticateToken, authorizeRoles(UserRole.MENTOR), async (req: any, res) => {
    try {
        const mentorId = req.user.userId;
        const [volunteers] = await pool.query(
            `SELECT v.volunteer_id, u.name, u.roll_number, u.wing_name 
             FROM volunteers v 
             JOIN users u ON v.user_id = u.user_id 
             WHERE v.mentor_id = ?
             ORDER BY u.name`,
            [mentorId]
        );
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark attendance for multiple volunteers
router.post('/mark-bulk', authenticateToken, authorizeRoles(UserRole.MENTOR), async (req: any, res) => {
    const { eventId, attendanceRecords } = req.body;
    const mentorId = req.user.userId;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get event details
        const [eventRows]: any = await connection.query(
            'SELECT duration_hours FROM events WHERE event_id = ?',
            [eventId]
        );
        const eventHours = eventRows[0]?.duration_hours || 0;

        // Insert attendance records
        for (const record of attendanceRecords) {
            const { volunteerId, isPresent } = record;
            const hours = isPresent ? eventHours : 0;

            // Insert attendance record
            await connection.query(
                `INSERT INTO attendance 
                (volunteer_id, event_id, marked_by, attendance_date, attendance_time, 
                hours_given, attendance_type_id)
                VALUES (?, ?, ?, CURDATE(), CURTIME(), ?, ?)`,
                [volunteerId, eventId, mentorId, hours, isPresent ? 1 : 2]
            );

            // Update volunteer's total hours and events attended
            if (isPresent) {
                await connection.query(
                    `UPDATE volunteers 
                    SET total_hours = total_hours + ?, events_attended = events_attended + 1
                    WHERE volunteer_id = ?`,
                    [hours, volunteerId]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
});

// Get attendance history for a volunteer
router.get('/history/:volunteerId', authenticateToken, async (req: any, res) => {
    try {
        const [history] = await pool.query(
            `SELECT 
                a.attendance_id,
                e.event_name,
                e.event_date,
                a.hours_given,
                at.type_name as attendance_status,
                u.name as marked_by_name
             FROM attendance a
             JOIN events e ON a.event_id = e.event_id
             JOIN attendance_types at ON a.attendance_type_id = at.type_id
             JOIN users u ON a.marked_by = u.user_id
             WHERE a.volunteer_id = ?
             ORDER BY e.event_date DESC`,
            [req.params.volunteerId]
        );
        res.json(history);
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Modify volunteer hours (for mentors and gen_sec)
router.post('/modify-hours', authenticateToken, authorizeRoles(UserRole.MENTOR, UserRole.GEN_SEC), async (req: any, res) => {
    const { volunteerId, eventId, newHours, reason } = req.body;
    const modifiedBy = req.user.userId;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get current hours
        const [currentHours]: any = await connection.query(
            'SELECT hours_given FROM attendance WHERE volunteer_id = ? AND event_id = ?',
            [volunteerId, eventId]
        );
        const oldHours = currentHours[0]?.hours_given || 0;

        // Update attendance hours
        await connection.query(
            'UPDATE attendance SET hours_given = ? WHERE volunteer_id = ? AND event_id = ?',
            [newHours, volunteerId, eventId]
        );

        // Update volunteer's total hours
        await connection.query(
            'UPDATE volunteers SET total_hours = total_hours + ? WHERE volunteer_id = ?',
            [newHours - oldHours, volunteerId]
        );

        // Log the modification
        await connection.query(
            `INSERT INTO hours_modification_log 
            (volunteer_id, modified_by, event_id, old_hours, new_hours, modification_date, reason)
            VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
            [volunteerId, modifiedBy, eventId, oldHours, newHours, reason]
        );

        await connection.commit();
        res.json({ message: 'Hours modified successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error modifying hours:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
});

export default router; 