import express, { Request, Response } from 'express';
import { pool } from '../db';


const router = express.Router();

// 🟡 Get all parking spots
router.get('/', async (_req: Request, res: Response) => {
  try {
    const {rows} = await pool.query('SELECT * FROM parking_spots');
    res.json(rows);
  } catch (err) {
    console.error('Error while fetching parking spots:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// POST add a spot
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

// GET boking spot 
router.get('/:id',async(req:Request,res:Response)=>{
    const spotId = parseInt(req.params.id,10) 
    if (isNaN(spotId)){
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

// PUT Update spot information
router.put('/:id', async(req:Request, res:Response)=>{
    const spotId = parseInt(req.params.id, 10)
    const {location, start_time, end_time, price} = req.body

    if(isNaN(spotId)){
        res.status(400).json({error: 'Invalid id' })
        return
    }
    try {
        const {rows} = await pool.query(
            `UPDATE parking_spots SET 
            location = $1, 
            start_time = $2,
            end_time = $3,
            price = $4 
            WHERE id = $5
            RETURNING *`,
            [location,start_time,end_time,price,spotId]
        )
        if(rows.length === 0){
            res.status(404).json({error: 'Spot not found'})
            return
        }
        res.json(rows[0])
    } catch (error) {
        console.error('Error updating spot', error);
        res.status(500).json({ error: 'Server error' });
    }
})

// DELETE 
router.delete('/:id', async(req:Request, res:Response)=>{
    const spotId = parseInt(req.params.id,10)
    if(isNaN(spotId)){
        res.status(400).json({error: 'Invalid id' })
        return
    }
    try {
        // Kontrollera om några uthyrare använder den här platsen
        const rentalCheck = await pool.query(
            'SELECT * FROM rentals WHERE spot_id = $1',
            [spotId]
        );
      
        if (rentalCheck.rows.length > 0) {
          res.status(400).json({ error: 'Parkeringsplatsen är bokad och kan inte raderas.' });
          return
        }

        // If no one has booked, proceed to delete
        const {rows} = await pool.query(
            `DELETE FROM parking_spots 
            WHERE id = $1 RETURNING *`,
            [spotId]
        )
        if(rows.length === 0){
            res.status(404).json({error: 'Spot not found'})
            return
        }
        res.status(200).json({ message: 'Spot is deleted', spot: rows[0] });
    } catch (error) {
        console.error('Error deleting spot', error);
        res.status(500).json({ error: 'Server error' });
    }
}) 
export default router;
