const API_KEY = '3fbe29e5-d1a1-48cd-8cd2-1c2d5f993796';
const LIVE_MATCHES_URL = 'https://api.cricapi.com/v1/currentMatches';

class LiveMatchesService {
    static async getLiveMatches() {
        try {
            const response = await fetch(`${LIVE_MATCHES_URL}?apikey=${API_KEY}`);
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching live matches:', error);
            return [];
        }
    }

    static updateLiveScores() {
        const liveScoresContainer = document.getElementById('live-scores-container');
        
        this.getLiveMatches()
            .then(matches => {
                if (!matches.length) {
                    liveScoresContainer.innerHTML = '<p class="text-center">No IPL matches at the moment</p>';
                    return;
                }

                // Filter for IPL matches and get latest 6
                const iplMatches = matches
                    .filter(match => 
                        match.name.toLowerCase().includes('ipl') || 
                        match.series_id === 'c75f8952-74d4-416f-b7b4-7da4b4e3ae6e' // IPL series ID
                    )
                    .slice(0, 6);

                if (!iplMatches.length) {
                    liveScoresContainer.innerHTML = '<p class="text-center">No IPL matches available right now</p>';
                    return;
                }

                const matchesHTML = iplMatches
                    .map(match => `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100 shadow-sm">
                                <div class="card-header bg-primary text-white text-center">
                                    IPL 2024
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-5 text-center">
                                            <img src="${match.teamInfo?.[0]?.img || 'default-team.png'}" 
                                                 alt="${match.teams[0]}" 
                                                 class="team-logo mb-2" 
                                                 width="50">
                                            <h6>${match.teams[0]}</h6>
                                            <h4 class="score">${match.score[0] || 'Yet to bat'}</h4>
                                        </div>
                                        <div class="col-2 text-center d-flex align-items-center justify-content-center">
                                            <span class="badge bg-warning text-dark">VS</span>
                                        </div>
                                        <div class="col-5 text-center">
                                            <img src="${match.teamInfo?.[1]?.img || 'default-team.png'}" 
                                                 alt="${match.teams[1]}" 
                                                 class="team-logo mb-2" 
                                                 width="50">
                                            <h6>${match.teams[1]}</h6>
                                            <h4 class="score">${match.score[1] || 'Yet to bat'}</h4>
                                        </div>
                                    </div>
                                    <div class="text-center mt-3">
                                        <div class="match-status ${match.status.includes('won') ? 'text-success' : 'text-primary'}">
                                            ${match.status}
                                        </div>
                                        <small class="text-muted">${match.venue}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('');

                liveScoresContainer.innerHTML = `
                    <div class="row">
                        ${matchesHTML}
                    </div>`;
            });
    }
}

// Update scores every 30 seconds
setInterval(() => LiveMatchesService.updateLiveScores(), 30000);

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    LiveMatchesService.updateLiveScores();
});
