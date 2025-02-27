// Team Registration handling
document.addEventListener('DOMContentLoaded', function() {
    const teamRegistrationForm = document.getElementById('teamRegistrationForm');
    
    if(teamRegistrationForm) {
        teamRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateTeamRegistration()) {
                return;
            }
            
            // Collect form data
            const formData = new FormData();
            formData.append('teamName', document.getElementById('teamName').value);
            formData.append('teamShortName', document.getElementById('teamShortName').value);
            formData.append('teamDescription', document.getElementById('teamDescription').value);
            formData.append('managerName', document.getElementById('managerName').value);
            formData.append('managerPhone', document.getElementById('managerPhone').value);
            formData.append('managerEmail', document.getElementById('managerEmail').value);
            formData.append('groundName', document.getElementById('groundName').value);
            formData.append('groundCapacity', document.getElementById('groundCapacity').value);
            formData.append('groundAddress', document.getElementById('groundAddress').value);
            
            // Handle file upload
            const logoFile = document.getElementById('teamLogo').files[0];
            if (logoFile) {
                formData.append('teamLogo', logoFile);
            }
            
            handleTeamRegistration(formData);
        });
    }
});

// Validation function
function validateTeamRegistration() {
    // Team Name validation
    const teamName = document.getElementById('teamName').value;
    if (teamName.length < 3) {
        showAlert('Team name must be at least 3 characters long', 'danger');
        return false;
    }
    
    // Team Short Name validation
    const teamShortName = document.getElementById('teamShortName').value;
    if (teamShortName.length < 2 || teamShortName.length > 4) {
        showAlert('Team short name must be between 2 and 4 characters', 'danger');
        return false;
    }
    
    // Manager Phone validation
    const phone = document.getElementById('managerPhone').value;
    if (!validatePhone(phone)) {
        showAlert('Please enter a valid phone number', 'danger');
        return false;
    }
    
    // Manager Email validation
    const email = document.getElementById('managerEmail').value;
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return false;
    }
    
    return true;
}

// API handling function
async function handleTeamRegistration(formData) {
    try {
        const response = await fetch('/api/teams/register', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });
        
        if (response.ok) {
            showAlert('Team registered successfully!', 'success');
            setTimeout(() => {
                $('#teamRegistrationModal').modal('hide');
                // Redirect to team dashboard or refresh page
                window.location.href = '/team-dashboard.html';
            }, 2000);
        } else {
            const error = await response.json();
            showAlert(error.message || 'Team registration failed', 'danger');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again later.', 'danger');
        console.error('Team registration error:', error);
    }
}

// Update the showAlert function to handle different modal bodies
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const modalBody = document.querySelector('.modal-body');
    modalBody.insertBefore(alertDiv, modalBody.firstChild);
}