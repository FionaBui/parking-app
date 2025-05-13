import express, { Request, Response } from 'express';
import { pool } from '../db';

const router = express.Router();

// 🟡 Hämta alla parkeringsplatser
router.get('/', async (_req: Request, res: Response) => {
  try {
    const {rows} = await pool.query('SELECT * FROM parking_spots');
    res.json(rows);
  } catch (err) {
    console.error('Error while fetching parking spots:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
