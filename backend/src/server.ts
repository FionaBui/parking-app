// Importera de nödvändiga biblioteken
import express from 'express';
import dotenv from 'dotenv'
import { pool } from './db';
import parkingSpotsRoutes from './routes/parkingSpots';
import rentalRoute from './routes/rentalRoute';

// Initiera Express-applikationen
dotenv.config();
const app = express();
const PORT = 3001;

// Middleware 
app.use(express.json());

// Anslut PostgreSQL för testning
pool.connect()
.then(()=> console.log('Connected to PostgreSQL via pg'))
.catch((err)=> console.error(err))

// 🟡 Alla rutter till /parking-spots hanteras i routerfilen
app.use('/parking-spots', parkingSpotsRoutes);
app.use('/rentals', rentalRoute );

app.listen(PORT, () => {
  console.log(`🚗 Server is running at http://localhost:${PORT}`);
});
