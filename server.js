const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Sample team data
const teams = [
    { name: "Warriors", manager: "John Doe" },
    { name: "Titans", manager: "Jane Smith" },
    { name: "Knights", manager: "Alex Brown" },
    { name: "Strikers", manager: "Chris Green" },
    { name: "Royals", manager: "Sarah Lee" }
];

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route to get all teams
app.get('/api/teams', (req, res) => {
    res.json(teams);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});