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

// POST
router.post('/', async(req:Request, res:Response)=>{
    const {owner_id, location, start_time, end_time, price} = req.body

    if(!owner_id || !location || !start_time || !end_time){
        res.status(400).json({error: 'All fields are required.'})
        return
    }

    try {
        const {rows} = await pool.query(
            `INSERT INTO parking_spots (owner_id, location, start_time, end_time, price) 
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [owner_id, location, start_time, end_time, price || 0]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        console.error('Error creating location', err);
        res.status(500).json({ error: 'Server error when saving location' });
    }
})

router.get('/:id',async(req:Request,res:Response)=>{
    const spotId = parseInt(req.params.id,10) 
    if (!spotId){
        res.status(400).json({error: 'Invalid id' })
        return
    }
    try {
        const {rows} = await pool.query(`
            SELECT * FROM parking_spots WHERE id = $1`, [spotId])
        if(rows.length === 0){
            res.status(404).json({error: 'Spot not found'})
            return
        }
        res.json(rows[0])
    } catch (error) {
        console.error('Error getting spot',error)
        res.status(500).json({error: 'Server error'})
    }
})
export default router;
