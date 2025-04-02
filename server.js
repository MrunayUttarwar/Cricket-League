const http = require('http');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./config/db');

const server = http.createServer(async (req, res) => {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Define allowed endpoints and their methods
    const endpoints = {
        '/api/players/register': ['POST'],
        '/api/auth/register': ['POST'],  // Add this line
        '/js/*': ['GET']
    };

    // Check if method is allowed for the endpoint
    const isMethodAllowed = (url, method) => {
        for (const [pattern, methods] of Object.entries(endpoints)) {
            if (pattern.endsWith('*')) {
                const prefix = pattern.slice(0, -1);
                if (url.startsWith(prefix) && methods.includes(method)) {
                    return true;
                }
            } else if (url === pattern && methods.includes(method)) {
                return true;
            }
        }
        return false;
    };

    // Check if endpoint exists but method is not allowed
    const endpointExists = (url) => {
        for (const pattern of Object.keys(endpoints)) {
            if (pattern.endsWith('*')) {
                const prefix = pattern.slice(0, -1);
                if (url.startsWith(prefix)) return true;
            } else if (url === pattern) {
                return true;
            }
        }
        return false;
    };

    // Handle method not allowed
    if (endpointExists(req.url) && !isMethodAllowed(req.url, req.method)) {
        res.writeHead(405, { 
            'Content-Type': 'application/json',
            'Allow': endpoints[req.url]?.join(', ') || 'GET, POST'
        });
        res.end(JSON.stringify({ 
            error: 'Method Not Allowed',
            message: `${req.method} is not allowed for this endpoint`
        }));
        return;
    }

    // Handle GET requests for static files
    if (req.method === 'GET' && req.url.startsWith('/js/')) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
        return;
    }

    // Handle POST request for player registration
    if (req.method === 'POST' && req.url === '/api/players/register') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const playerData = JSON.parse(body);
                
                // Validate required fields
                if (!playerData.playerName || !playerData.email || !playerData.team || !playerData.role) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                // Connect to MongoDB
                const db = await connectDB();
                const players = db.collection('players');

                // Check if email already exists
                const existingPlayer = await players.findOne({ email: playerData.email });
                if (existingPlayer) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Email already registered' }));
                    return;
                }

                // Insert new player
                const result = await players.insertOne({
                    playerName: playerData.playerName,
                    email: playerData.email,
                    team: playerData.team,
                    role: playerData.role,
                    termsAccepted: playerData.termsAccepted,
                    registrationDate: new Date(),
                    createdAt: new Date()
                });

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Player registered successfully',
                    playerId: result.insertedId
                }));

            } catch (error) {
                console.error('Registration error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/api/auth/register') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);
                
                // Validate required fields
                if (!userData.email || !userData.password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                // Connect to MongoDB
                const db = await connectDB();
                const users = db.collection('users');

                // Check if email already exists
                const existingUser = await users.findOne({ email: userData.email });
                if (existingUser) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Email already registered' }));
                    return;
                }

                // Insert new user
                const result = await users.insertOne({
                    email: userData.email,
                    password: userData.password, // Note: In production, hash the password
                    createdAt: new Date()
                });

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'User registered successfully',
                    userId: result.insertedId
                }));

            } catch (error) {
                console.error('Auth registration error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    } else if (req.method === 'POST') {
        // Handle unknown POST endpoints
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});