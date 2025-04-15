class StatsAPI {
    static BASE_URL = 'http://localhost:3000/api';

    static async getPlayers() {
        try {
            const response = await fetch(`${this.BASE_URL}/players`);
            if (!response.ok) throw new Error('Failed to fetch players');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async addPlayerStats(statsData) {
        try {
            const response = await fetch(`${this.BASE_URL}/player-stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statsData)
            });
            if (!response.ok) throw new Error('Failed to add stats');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async getPlayerStats(playerId) {
        try {
            const response = await fetch(`${this.BASE_URL}/player-stats/${playerId}`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            console.log('Fetched stats:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}