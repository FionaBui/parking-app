import express, { Request, Response } from 'express';
import { client } from '../db';


const router = express.Router();

router.get('/:id', async(req:Request, res:Response)=>{
    const userId = parseInt(req.params.id,10)
    if(isNaN(userId)){
        res.status(400).json({error: 'Invalid user id'})
    }
    try {
        const {rows:rentals} = await client.query( 
            `SELECT rentals.*, parking_spots.location, parking_spots.price FROM rentals
            JOIN parking_spots ON rentals.spot_id = parking_spots.id WHERE rentals.renter_id = $1`, [userId])
        const {rows: spots_for_rent} = await client.query(
            `SELECT ps.*,
               EXISTS (
                 SELECT 1 FROM rentals r WHERE r.spot_id = ps.id) AS is_rented
            FROM parking_spots ps
            WHERE ps.owner_id = $1`, [userId])
        res.json({
            user_id : userId,
            total_rentals : rentals.length,
            rentals,
            spots_for_rent
        })
    } catch (error) {
        console.error('Error fetching user activity:', error)
        res.status(500).json({error:'Server error'})
    }
})

export default router;
