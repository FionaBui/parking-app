import express, { Request, Response } from 'express';
import { client } from '../db';

const router = express.Router();

// POST: Skapa ny bokning
router.post('/', async(req:Request, res:Response)=>{
    console.log("Booking request received:", req.body);
    const {spot_id, renter_id, rent_date, rent_start_time, rent_end_time} = req.body

    if(!spot_id || !renter_id || !rent_date ||!rent_start_time || !rent_end_time){
        res.status(400).json({error: 'Missing required fields'})
        return
    }

    try {
        // 1.Kontrollera om det har hyrts ut den dagen
        const {rows: exists} = await client.query(
            'SELECT * FROM rentals WHERE spot_id = $1 AND rent_date = $2',
            [spot_id, rent_date]
        )

        if (exists.length > 0){
            res.status(404).json({ error: 'This spot is already booked on that date' })
            return
        }

        // 2. Hämta den tillgängliga tiden för platsen den dagen
        const {rows: available} = await client.query(
            `SELECT start_time, end_time FROM available_spot WHERE spot_id = $1 AND date= CAST($2 AS DATE)`,[spot_id, rent_date]
        )

        if (available.length === 0){
            res.status(400).json({error: "This spot is not available on that date" })
            return
        }
        const availableStart = available[0].start_time
        const availableEnd = available[0].end_time

        // 3. Jämför hyresgästens begärda tid med den tillgängliga tiden
        const start = new Date(`1970-01-01T${rent_start_time}:00`);
        const end = new Date(`1970-01-01T${rent_end_time}:00`);
        const availableStartTime = new Date(`1970-01-01T${availableStart}:00`);
        const availableEndTime = new Date(`1970-01-01T${availableEnd}:00`);

        if (start < availableStartTime || end > availableEndTime) {
        res.status(400).json({ error: "Time is not available" });
        return;
}

        // 4. Skapa bokning

        const { rows: inserted } = await client.query(
            `INSERT INTO rentals (spot_id, renter_id, rent_date, rent_start_time, rent_end_time)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [spot_id, renter_id, rent_date, rent_start_time, rent_end_time]
          );
      
        res.status(201).json({ message: "Rental created", rental: inserted[0] });
        
    } catch (err) {
        console.error('Error creating rental', err);
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
        return
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
