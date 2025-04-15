class MatchesAPI {
    static BASE_URL = 'http://localhost:3000/api';

    static async scheduleMatch(matchData) {
        try {
            const response = await fetch(`${this.BASE_URL}/matches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(matchData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to schedule match');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async getScheduledMatches() {
        try {
            const response = await fetch(`${this.BASE_URL}/matches`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}