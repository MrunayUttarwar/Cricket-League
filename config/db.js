const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const dbName = "cricket-league";

let client = null;

async function connectDB() {
    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
            console.log('Connected to MongoDB');
        }
        return client.db(dbName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = { connectDB };