const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// helper to read JSON files from data folder
function readJSON(name) {
  const p = path.join(__dirname, 'data', name);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

app.get('/api/tutorials', (req, res) => {
  res.json(readJSON('tutorials.json'));
});

app.get('/api/exercises', (req, res) => {
  res.json(readJSON('exercises.json'));
});

app.get('/api/funfacts', (req, res) => {
  res.json(readJSON('funfacts.json'));
});

// simple scoring endpoint for submitted answers (very basic)
app.post('/api/check', (req, res) => {
  const { answers } = req.body;
  let score = 0;
  if (Array.isArray(answers)) {
    answers.forEach(a => { if (a.correct) score += 1; });
  }
  res.json({ score, total: Array.isArray(answers) ? answers.length : 0 });
});

app.listen(PORT, () => {
  console.log(`AI Sparck running on http://localhost:${PORT}`);
});
