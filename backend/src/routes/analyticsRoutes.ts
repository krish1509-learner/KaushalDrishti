import express from 'express';

const router = express.Router();

// TODO: Implement analytics routes
router.get('/', (req, res) => {
  res.send('Analytics route placeholder');
});

export default router;
