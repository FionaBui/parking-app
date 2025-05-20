import express, { Request, Response } from 'express';
import { client } from '../db';

const router = express.Router();

// POST
router.post('/', async(req:Request, res:Response)=>{
    const {spot_id, renter_id, rent_date} = req.body

    if(!spot_id || !renter_id || !rent_date){
        res.status(400).json({error: 'spot_id, renter_id and rent_date are required.'})
        return
    }

    try {
        // Hitta plats efter platssträng som A-1 → hämta ID
        const {rows: spots} = await client.query(
            'SELECT id, owner_id FROM parking_spots WHERE location = $1 AND owner_id IS NOT NULL',
            [spot_id]
        )

        if (spots.length === 0){
            res.status(404).json({ error: 'Spot not found or not available for rent' })
        }

        const spotRentalId = spots[0].id

        // 2. Kontrollera om det har hyrts ut den dagen
        const {rows : rented} = await client.query(
            'SELECT * FROM rentals WHERE spot_id = $1 AND DATE(rent_time) = $2',[spotRentalId, rent_date]
        )

        if(rented.length > 0){
            res.status(400).json({ error: 'This spot is already rented on that day' });
            return
        }
        // 3. Lägga i rentals
        const {rows: inserted} = await client.query(
            'INSERT INTO rentals (spot_id, renter_id, rent_time) VALUES ($1,$2,$3) RETURNING *',[spotRentalId,renter_id,rent_date]
        )
        res.status(201).json(inserted[0])
    } catch (err) {
        console.error('Error when booking', err);
        res.status(500).json({ error: 'Server error during booking' });
    }
})

// DELETE: cancel rental spot

router.delete('/cancel', async(req:Request, res:Response)=>{
  const spotId = parseInt(req.query.spot as string,10)
  const userId = parseInt(req.query.user as string, 10)
  const date = req.query.date as string

  if(isNaN(spotId) || isNaN(userId) || !date){
    res.status(400).json({error: "Missing spot, user or date"})
  }

  try {
  // Kontrollera om hyresobjektet som ska raderas finns
    const {rows : exists } = await client.query(
        `SELECT * FROM rentals
        WHERE spot_id =$1 AND renter_id = $2 AND rent_date = $3`,[spotId, userId, date]
    ) 
    if (exists.length === 0){
        res.status(404).json({error: "Rental not found"})
    }
    const {rows : deleted} = await client.query(
        `DELETE FROM rentals 
        WHERE spot_id = $1 AND renter_id= $2 AND rent_date=$3
        RETURNING *`,[spotId, userId,date]
    )
    res.status(200).json({rental: deleted[0]})
  } catch (error) {
    console.error("Error cancelling rental:", error);
    res.status(500).json({ error: "Server error" });
  }
})

export default router;
