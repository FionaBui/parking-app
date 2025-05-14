import express, { Request, Response } from 'express';
import { client } from '../db';

const router = express.Router();

// POST
router.post('/', async(req:Request, res:Response)=>{
    const {spot_id, renter_id} = req.body

    if(!spot_id || !renter_id){
        res.status(400).json({error: 'spot_id and renter_id are required.'})
        return
    }

    try {
        const {rows} = await client.query(
            `INSERT INTO rentals (spot_id, renter_id) 
            VALUES ($1,$2)
            RETURNING *`,
            [spot_id, renter_id]
        )
        await client.query(
          `UPDATE parking_spots SET is_available = false WHERE id = $1`, [spot_id]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        console.error('Error when booking', err);
        res.status(500).json({ error: 'Server error during booking' });
    }
})

export default router;
