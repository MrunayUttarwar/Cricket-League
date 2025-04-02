document.addEventListener('DOMContentLoaded', function() {
    const playerForm = document.getElementById('playerRegistrationForm');
    if (playerForm) {
        playerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            try {
                const formData = {
                    playerName: document.getElementById('playerName').value,
                    email: document.getElementById('email').value,
                    team: document.getElementById('team').value,
                    role: document.getElementById('role').value,
                    termsAccepted: document.getElementById('terms').checked,
                    registrationDate: new Date()
                };

                const response = await fetch('http://localhost:5500/api/players/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Registration failed');
                }

                const result = await response.json();
                alert('Player Registered Successfully!');
                this.reset();
            } catch (error) {
                alert('Registration failed: ' + error.message);
                console.error('Error:', error);
            }
        });
    }
});