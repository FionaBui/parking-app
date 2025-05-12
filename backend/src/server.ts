import express from 'express';

const app = express();
const PORT = 3500;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`🚗 Server is running at http://localhost:${PORT}`);
});
