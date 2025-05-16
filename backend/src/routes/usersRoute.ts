import express, { Request, Response } from 'express';
import { client } from '../db';
import { error } from 'console';


const router = express.Router();

router.post('/register', async(req:Request,res:Response)=>{
    const {name, email, apartment_info } = req.body

    if(!name || !email || !apartment_info){
        res.status(400).json({error: 'Missing required fields'})
        return
    }
    
    try {
        const {rows } = await client.query(
            `INSERT INTO users (name , email, apartment_info) VALUES ($1,$2,$3)`,[name, email,apartment_info]
        )
        res.status(201).json(rows[0])
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({error: 'Server error'})
    }
})

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
