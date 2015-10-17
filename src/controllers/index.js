import express from 'express';

const router = new express.Router();
export default router;

router.get('/', (req, res) =>
  res.send('hello world'));
