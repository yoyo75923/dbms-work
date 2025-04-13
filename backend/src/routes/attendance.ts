import express, { Request, Response } from 'express';
import { db } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Mark attendance for multiple volunteers
router.post('/mark', authenticateToken, async (req: Request, res: Response) => {
  const { eventId, volunteerIds } = req.body;
  const markerId = (req as any).user.id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const volunteerId of volunteerIds) {
      // Check if attendance already exists
      const [existingRecords]: any = await connection.execute(
        'SELECT id FROM attendance WHERE event_id = ? AND volunteer_id = ?',
        [eventId, volunteerId]
      );

      if (existingRecords.length === 0) {
        await connection.execute(
          'INSERT INTO attendance (event_id, volunteer_id, marked_by, status) VALUES (?, ?, ?, ?)',
          [eventId, volunteerId, markerId, 'present']
        );
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  } finally {
    connection.release();
  }
});

// Get attendance records for a volunteer
router.get('/volunteer/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const records = await db.query(
      `SELECT a.*, e.title as event_name, e.hours, e.location as venue, 
              e.start_time, e.end_time
       FROM attendance a
       JOIN events e ON a.event_id = e.id
       WHERE a.volunteer_id = ?
       ORDER BY a.marked_at DESC`,
      [req.params.id]
    );
    res.json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get attendance summary for a volunteer
router.get('/summary/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const [summary] = await db.query(
      `SELECT 
         COUNT(DISTINCT a.event_id) as events_attended,
         SUM(e.hours) as total_hours
       FROM attendance a
       JOIN events e ON a.event_id = e.id
       WHERE a.volunteer_id = ? AND a.status = 'present'`,
      [req.params.id]
    ) as any[];
    res.json(summary || { events_attended: 0, total_hours: 0 });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ error: 'Failed to fetch attendance summary' });
  }
});

export default router; 