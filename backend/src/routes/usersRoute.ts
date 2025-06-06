import express, { Request, Response } from 'express';
import { client } from '../db';
import { error } from 'console';


const router = express.Router();

// POST /register – Registrera användare + knyta parkeringsplats
router.post('/register', async(req:Request,res:Response)=>{
    const {name, email, apartment_info, spot_location } = req.body

    if(!name || !email || !apartment_info){
        res.status(400).json({error: 'Missing required fields'})
        return
    }
    try {
        await client.query('BEGIN');
        const {rows : existingUser } = await client.query (
            `SELECT * FROM users WHERE email = $1`, [email]
        )
        if(existingUser.length > 0){
            await client.query('ROLLBACK');
            res.status(400).json({error: 'Email already exists'})
            return
        }

        const {rows: userRows } = await client.query(
            `INSERT INTO users (name , email, apartment_info) VALUES ($1,$2,$3) RETURNING *`,[name, email,apartment_info]
        )
        const user = userRows[0];
        // Om användaren anger en parkeringsplatskod, uppdatera owner_id för den platsen.
        if(spot_location){
            const updateResult = await client.query(
                `UPDATE parking_spots SET owner_id = $1 WHERE location = $2 AND owner_id IS NULL RETURNING *`, [user.id, spot_location]
            )
            if(updateResult.rows.length === 0){
                await client.query('ROLLBACK'); 
                res.status(400).json({error: 'Invalid or already-owned spot location'})
                return
            }

            console.log('updateResult',updateResult);
        }
        await client.query('COMMIT'); 
        res.status(201).json(user)
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating user:', error)
        res.status(500).json({error: 'Server error'})
    } 
})

// POST /login – Logga in användare
router.post('/login', async(req:Request,res:Response)=>{
    const {email} = req.body

    if(!email) {
        res.status(400).json({error: 'Email is required'});
        return
    }
    try {
        const {rows} = await client.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        )
        if(rows.length === 0){
            res.status(401).json({error: 'Invalid email'})
            return
        }
        res.status(200).json(rows[0])
    } catch (error) {
        console.error('Error during login', error)
        res.status(500).json({error: 'Server error'})
    }
})

// GET /:id – Hämta användarens aktivitet
router.get('/:id', async(req:Request, res:Response)=>{
    const userId = parseInt(req.params.id, 10)
    if (isNaN(userId)){
        res.status(400).json({error:'Invalid user ID'})
        return
    }
    try {
        // 1. Hämta en lista över platser som den här användaren har hyrt
        const {rows: rentalResult} = await client.query(
            `SELECT r.*, ps.location
            FROM rentals r 
            JOIN parking_spots ps ON r.spot_id = ps.id
            WHERE r.renter_id = $1`, [userId]
        )
        // 2. Hämta en lista över plats som den här användaren äger
        const {rows: ownerSpotResult} = await client.query(
            `SELECT * FROM parking_spots WHERE owner_id = $1`, [userId]
        )
        const ownerSpot = ownerSpotResult[0] || null;

        // 3. result
        res.json({
            user_id: userId,
            total_rentals: rentalResult.length,
            rentals: rentalResult,
            owner_spot: ownerSpot,
        })

        
    } catch (error) {
        console.error('Error fetching user activity:', error);
        res.status(500).json({ error: 'Server error' });
    }
})



export default router;
