import express from 'express';
const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ message: 'User routes working' });
});

export default router; 