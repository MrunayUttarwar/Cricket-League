require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const PlayerStats = require('./models/PlayerStats');
const Match = require('./models/Match');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins during testing
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, userRole } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password || !userRole) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userRole
        });

        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Create user object without password
        const userResponse = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userRole: user.userRole
        };

        res.status(200).json({
            message: 'Login successful',
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login',
            error: error.message 
        });
    }
});

// Add player statistics
app.post('/api/player-stats', async (req, res) => {
    try {
        const { playerId, matches, runs, wickets, average, strikeRate, fifties, hundreds } = req.body;
        
        const playerStats = new PlayerStats({
            playerId,
            matches,
            runs,
            wickets,
            average,
            strikeRate,
            fifties,
            hundreds
        });

        await playerStats.save();
        res.status(201).json({ message: 'Player statistics added successfully' });
    } catch (error) {
        console.error('Error adding player stats:', error);
        res.status(500).json({ message: 'Server error while adding stats' });
    }
});

// Get all stats for a player
app.get('/api/player-stats/:playerId', async (req, res) => {
    try {
        const stats = await PlayerStats.find({ playerId: req.params.playerId })
            .sort({ timestamp: -1 }) // Get most recent first
            .limit(1);
        
        console.log('Found stats:', stats); // Debug log
        
        if (!stats || stats.length === 0) {
            return res.status(404).json({ message: 'No stats found for this player' });
        }
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching player stats:', error);
        res.status(500).json({ message: 'Error fetching player stats' });
    }
});

// Get all players
app.get('/api/players', async (req, res) => {
    try {
        const players = await User.find({ userRole: 'player' }, 'firstName lastName _id');
        const formattedPlayers = players.map(player => ({
            id: player._id,
            name: `${player.firstName} ${player.lastName}`
        }));
        res.json(formattedPlayers);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Error fetching players' });
    }
});

// Schedule a match
app.post('/api/matches', async (req, res) => {
    try {
        const { teamA, teamB, matchDate, matchTime, venue } = req.body;

        // Basic validation
        if (!teamA || !teamB || !matchDate || !matchTime || !venue) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new match
        const match = new Match({
            teamA,
            teamB,
            matchDate,
            matchTime,
            venue
        });

        await match.save();
        res.status(201).json({ message: 'Match scheduled successfully', match });
    } catch (error) {
        console.error('Error scheduling match:', error);
        res.status(500).json({ message: 'Error scheduling match' });
    }
});

// Get all scheduled matches
app.get('/api/matches', async (req, res) => {
    try {
        const matches = await Match.find()
            .sort({ matchDate: 1, matchTime: 1 }) // Sort by date and time
            .exec();
        res.json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Error fetching matches' });
    }
});

// Start server only after MongoDB connects
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});