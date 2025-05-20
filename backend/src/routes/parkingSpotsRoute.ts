import express, { Request, Response } from 'express';
import { client } from '../db';


const router = express.Router();

// Hämta alla parkeringsplatser
router.get('/', async (req: Request, res: Response) => {
  const date = req.query.date as string;
  const userId = parseInt(req.query.user as string , 10)

  if (!date || isNaN(userId)) {
   res.status(400).json({ error: 'Missing date or user ID' });
   return 
  }

  try {
    // 1. Hämta alla 50 platser från tabellen parking_spots
    const { rows: allSpots } = await client.query(
        'SELECT id AS spot_id, location, owner_id FROM parking_spots ORDER BY id'
      );
    // 2. Spot har daglig uthyrningsregistrering
    const {rows: available } = await client.query(`SELECT * FROM available_spot WHERE date = $1`, [date])

    // 3. Kolla vilka platser är bokade det datumet
    const { rows: rented } = await client.query(
        'SELECT spot_id, renter_id FROM rentals WHERE rent_date = $1',
        [date]
      );

    // 3.kombinera för att generera data för att återgå till frontend
    const result = allSpots.map((spot) => {
        const availableSpot = available.find(a=>a.spot_id === spot.spot_id)
      const rentalSpot = rented.find(r => r.spot_id === spot.spot_id)
      return {
        spot_id: spot.spot_id,                        
        spot_number: spot.location,              
        is_registered: spot.owner_id !== null,
        is_available: !!availableSpot,
        is_rented: !!rentalSpot,
        renter_id: rentalSpot?.renter_id || null,
        is_owner: spot.owner_id === userId,
        start_time: availableSpot?.start_time || null,
        end_time: availableSpot?.end_time || null,
        price: availableSpot?.price || 0,
      }
    });

    res.json(result)
  } catch (error) {
    console.error("Error loading parking spots:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT Update available spot information
router.put('/:id', async(req:Request, res:Response)=>{
    const spotId = parseInt(req.params.id, 10)
    const {user_id, date, start_time, end_time, price} = req.body

    if(isNaN(spotId)){
        res.status(400).json({error: 'Invalid spot id' })
        return
    }
    if (!start_time || !end_time || price === undefined || !user_id) {
        res.status(400).json({ error: 'Missing required fields' });
        return
      }
    try {
      // Kontrollera om användaren är platsägaren
      const {rows : checkOwner} = await client.query(
        `SELECT * FROM parking_spots 
        WHERE id = $1 AND owner_id = $2`,
        [spotId, user_id]
      )
      if (checkOwner.length === 0){
        res.status(403).json({error: 'Not the owner of this spot'})
        return
      }
      // Om en post för den dagen redan finns → uppdatera
      const {rows:exists} = await client.query(
        `SELECT * FROM available_spot WHERE spot_id = $1 AND date = $2`, [spotId, date]
      )

      if (exists.length > 0){
        const {rows : updated} = await client.query(
        `UPDATE available_spot 
        SET start_time = $1, end_time = $2, price = $3
        WHERE spot_id = $4 AND date = $5
        RETURNING *`,
        [start_time, end_time,price, spotId,date]
        )
        res.json({spot:updated[0]})
      }

      // Om inte redan → INSERT nytt
      const {rows: inserted} = await client.query(
        `INSERT INTO available_spot (spot_id, date, start_time, end_time, price)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [spotId, date, start_time, end_time, price]
      )
      res.status(201).json({spot: inserted[0]})

    } catch (error) {
        console.error('Error updating spot', error);
        res.status(500).json({ error: 'Server error' });
    }
})

// DELETE available spot
router.delete('/:id/availability', async(req:Request, res:Response)=>{
    const spotId = parseInt(req.params.id,10)
    const date = req.query.date as string
    const userId = parseInt(req.query.user as string, 10)
    if(isNaN(spotId) || !date || isNaN(userId)){
        res.status(400).json({error: 'Invalid id' })
        return
    }
    try {
      // Kontrollera ägarskap
      const {rows : checkOwner} = await client.query(
        `SELECT * FROM parking_spots 
        WHERE id = $1 AND owner_id = $2`,
        [spotId, userId]
      )
      if (checkOwner.length === 0){
        res.status(403).json({error: 'Not the owner of this spot'})
        return
      }
      // Kontrollera om några uthyrare använder den här platsen
      const {rows:rentalCheck} = await client.query(
        'SELECT * FROM rentals WHERE spot_id = $1 AND rent_date = $2',
        [spotId, date]
        );
        if (rentalCheck.length > 0) {
          res.status(400).json({ error: 'This spot is already rented today and cannot be cancelled' });
          return
        }

        // If no one has booked, proceed to delete
        const {rows: deleted} = await client.query(
            `DELETE FROM available_spot 
            WHERE spot_id = $1 AND date = $2 RETURNING *`,
            [spotId, date]
        )
        if(deleted.length === 0){
            res.status(404).json({error: 'Spot not found'})
            return
        }
        res.status(200).json({spot: deleted[0] });
    } catch (error) {
        console.error('Error deleting spot', error);
        res.status(500).json({ error: 'Server error' });
    }
}) 


// GET boking spot 
router.get('/:id',async(req:Request,res:Response)=>{
  const spotId = parseInt(req.params.id,10) 
  if (isNaN(spotId)){
      res.status(400).json({error: 'Invalid id' })
      return
  }
  try {
      const {rows} = await client.query(`
          SELECT * FROM parking_spots WHERE id = $1`, [spotId])
      if(rows.length === 0){
          res.status(404).json({error: 'Spot not found'})
          return
      }
      res.json({spot:rows[0]})
  } catch (error) {
      console.error('Error getting spot',error)
      res.status(500).json({error: 'Server error'})
  }
})

export default router;
