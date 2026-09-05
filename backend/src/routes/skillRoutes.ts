import express from 'express';

const router = express.Router();

// TODO: Implement skill routes
router.get('/', (req, res) => {
  res.send('Skill route placeholder');
});

export default router;
