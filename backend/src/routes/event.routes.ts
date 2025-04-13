import express from 'express';
const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Event routes working' });
});

export default router; 