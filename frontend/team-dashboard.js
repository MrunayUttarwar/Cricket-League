// Team Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {

    
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'index.html'; // Redirect to home if not logged in
            return;
        }


    // Load team data when page loads
    loadTeamData();
    
    // Handle Add Player form submission
    const addPlayerForm = document.getElementById('addPlayerForm');
    if(addPlayerForm) {
        addPlayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddPlayer();
        });
    }
    
    // Initialize any Bootstrap tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
});

// Load team data from API
async function loadTeamData() {
    try {
        const response = await fetch('/api/team/details', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if(response.ok) {
            const data = await response.json();
            updateDashboard(data);
        } else {
            console.error('Failed to load team data');
        }
    } catch(error) {
        console.error('Error loading team data:', error);
    }
}

// Update dashboard with team data
function updateDashboard(data) {
    // Update team info
    document.querySelector('.team-logo').src = data.logoUrl;
    document.querySelector('h3').textContent = data.teamName;
    document.querySelector('.text-muted').textContent = `Manager: ${data.managerName}`;
    
    // Update statistics
    updateStatistics(data.statistics);
    
    // Update matches
    updateUpcomingMatches(data.upcomingMatches);
    
    // Update players
    updatePlayersList(data.players);
}

// Handle adding new player
async function handleAddPlayer() {
    const formData = new FormData();
    formData.append('name', document.getElementById('playerName').value);
    formData.append('role', document.getElementById('playerRole').value);
    
    const photoFile = document.getElementById('playerPhoto').files[0];
    if(photoFile) {
        formData.append('photo', photoFile);
    }
    
    try {
        const response = await fetch('/api/team/addPlayer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });
        
        if(response.ok) {
            const result = await response.json();
            alert('Player added successfully!');
            loadTeamData(); // Reload team data to reflect the new player
        } else {
            console.error('Failed to add player');
            alert('Failed to add player. Please try again.');
        }
    } catch(error) {
        console.error('Error adding player:', error);
        alert('An error occurred while adding the player.');
    }
}

// Update statistics section
function updateStatistics(statistics) {
    const statsContainer = document.querySelector('.statistics');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Matches Played</span>
                <span class="stat-value">${statistics.matchesPlayed}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Wins</span>
                <span class="stat-value">${statistics.wins}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Losses</span>
                <span class="stat-value">${statistics.losses}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Draws</span>
                <span class="stat-value">${statistics.draws}</span>
            </div>
        `;
    }
}

// Update upcoming matches section
function updateUpcomingMatches(matches) {
    const matchesContainer = document.querySelector('.upcoming-matches');
    if (matchesContainer) {
        matchesContainer.innerHTML = matches.map(match => `
            <div class="match-item">
                <span class="match-date">${new Date(match.date).toLocaleDateString()}</span>
                <span class="match-vs">${match.opponent}</span>
                <span class="match-location">${match.location}</span>
            </div>
        `).join('');
    }
}

// Update players list
function updatePlayersList(players) {
    const playersContainer = document.querySelector('.players-list');
    if (playersContainer) {
        playersContainer.innerHTML = players.map(player => `
            <div class="player-item">
                <img src="${player.photoUrl}" alt="${player.name}" class="player-photo">
                <span class="player-name">${player.name}</span>
                <span class="player-role">${player.role}</span>
            </div>
        `).join('');
    }
}