import express from 'express';
import cors from 'cors';
import useSolver from './custody.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/solve', async (req, res) => {
  try {
    const { numberOfResults = 1, workingDays = [], nonWorkingDays = [], shanonDays = [], chaimDays = [] } = req.body;
    
    const results = await useSolver(numberOfResults, {
      numberOfResults,
      workingDays,
      nonWorkingDays,
      shanonDays,
      chaimDays
    });
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error solving:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
