const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

app.get('/api/questions', (req, res) => {
  const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
  res.json(questions);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));