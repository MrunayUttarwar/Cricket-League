// Authentication state management functions
function isAuthenticated() {
    return localStorage.getItem('authToken') !== null;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Protected route handling
function checkAuthAndRedirect() {
    const protectedPages = ['team-dashboard.html', 'players.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    
    // If on index.html and authenticated, redirect to dashboard
    if (currentPage === 'index.html' && isAuthenticated()) {
        window.location.href = 'team-dashboard.html';
        return false;
    }
    
    return true;
}

// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status for all pages
    checkAuthAndRedirect();
    
    // Add logout button functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Basic validation
            if(!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'danger');
                return;
            }
            
            if(password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'danger');
                return;
            }
            
            // Here you would typically make an API call to your backend
            handleLogin(email, password);
        });
    }
    
    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if(registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('registerEmail').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('registerPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                userRole: document.getElementById('userRole').value
            };
            
            // Validation
            if(!validateRegistrationData(formData)) {
                return;
            }
            
            // Here you would typically make an API call to your backend
            handleRegistration(formData);
        });
    }
});

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

function validateRegistrationData(data) {
    if(!validateEmail(data.email)) {
        showAlert('Please enter a valid email address', 'danger');
        return false;
    }
    
    if(!validatePhone(data.phone)) {
        showAlert('Please enter a valid phone number', 'danger');
        return false;
    }
    
    if(data.password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'danger');
        return false;
    }
    
    if(data.password !== data.confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return false;
    }
    
    return true;
}

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

// Modified handleLogin function with mock authentication
async function handleLogin(email, password) {
    try {
        // For development/testing purposes, simulate a successful login
        // Remove this block when you implement actual API calls
        const mockUser = {
            email: email,
            token: 'mock-token-' + Date.now()
        };
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        window.location.href = 'team-dashboard.html';
        return;

        // Your existing API call code (uncomment when ready to use)
        /*
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if(response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.location.href = 'teamdashboard.html';
        } else {
            showAlert('Invalid credentials', 'danger');
        }
        */
    } catch(error) {
        showAlert('An error occurred. Please try again later.', 'danger');
    }
}

// Registration handling function
async function handleRegistration(formData) {
    try {
        // Example API call
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if(response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            setTimeout(() => {
                $('#registerModal').modal('hide');
                $('#loginModal').modal('show');
            }, 2000);
        } else {
            showAlert('Registration failed. Please try again.', 'danger');
        }
    } catch(error) {
        showAlert('An error occurred. Please try again later.', 'danger');
    }
}