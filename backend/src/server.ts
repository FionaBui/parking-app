// Importera de nödvändiga biblioteken
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { client } from './db';
import parkingSpotsRoute from './routes/parkingSpotsRoute';
import rentalRoute from './routes/rentalRoute';
import usersRoute from './routes/usersRoute';

// Initiera Express-applikationen
dotenv.config();
const app = express();
const PORT = 3001;

// Middleware 
app.use(cors());
app.use(express.json());

// Anslut PostgreSQL för testning
client.connect()
.then(()=> console.log('Connected to PostgreSQL via pg'))
.catch((err)=> console.error(err))

// 🟡 Alla rutter till /parking-spots hanteras i routerfilen
app.use('/parking-spots', parkingSpotsRoute);
app.use('/rentals', rentalRoute );
app.use('/users', usersRoute)

app.listen(PORT, () => {
  console.log(`🚗 Server is running at http://localhost:${PORT}`);
});
