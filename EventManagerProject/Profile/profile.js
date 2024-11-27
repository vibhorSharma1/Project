function logout() {
    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '../Login/login.html';
}
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        // User is not logged in, redirect to login page
        window.location.href = '../Login/login.html';
    }
}

// Run this when page loads
checkAuth();

// Conectar el botón de logout con la función
document.querySelector('.logout-btn').addEventListener('click', logout);

// Get modal elements
const modal = document.getElementById('editModal');
const editBtn = document.querySelector('.edit-profile');
const closeBtn = document.querySelector('.close');
const editForm = document.getElementById('editProfileForm');

// Load user data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    // Get logged in user data
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (userData) {
        // Update user name next to profile logo
        document.getElementById('userName').textContent = userData.user_name || 'User Name';
        
        // Update user role/title
        document.querySelector('.user-title').textContent = userData.user_role || '';
    }
});

// Open modal
editBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    // Pre-fill form with current values
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    document.getElementById('editName').value = userData.user_name || '';
    document.getElementById('editEmail').value = userData.userEmail || '';
    document.getElementById('editRole').value = userData.user_role || '';
    document.getElementById('editOccupation').value = userData.user_organization || '';
    document.getElementById('editLocation').value = userData.user_address || '';
    
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal if clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle form submission
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get user data from localStorage to get user_id
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    const updatedData = {
        user_name: document.getElementById('editName').value,
        userEmail: document.getElementById('editEmail').value,
        user_role: document.getElementById('editRole').value,
        user_occupation: document.getElementById('editOccupation').value,
        user_address: document.getElementById('editLocation').value
    };

    try {
        const token = localStorage.getItem('token');
        
        // Updated URL format and changed method to POST
        const response = await fetch(`http://localhost:8080/api/user/update${currentUser.id}`, {
            method: 'POST',  // Changed from PUT to POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        
        // Store updated user data in localStorage
        const userToStore = {
            id: updatedUser.user_id,
            name: updatedUser.user_name,
            email: updatedUser.userEmail,
            role: updatedUser.user_role || '',
            organization: updatedUser.user_occupation || '',
            city: updatedUser.user_address || ''
        };
        
        localStorage.setItem('user', JSON.stringify(userToStore));

        // Update UI
        updateProfileUI(userToStore);
        
        // Close modal
        document.getElementById('editModal').style.display = 'none';
        
        alert('Profile updated successfully!');
    } catch (error) {
        alert('Error updating profile. Please try again.');
        console.error('Error:', error);
    }
});

// Function to load user profile
function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    updateProfileUI(userData);
}

// Function to update UI
function updateProfileUI(userData) {
    document.querySelector('.user-name').textContent = userData.name || 'User Name';
    document.querySelector('.info-grid').innerHTML = `
        <div class="info-item">
            <label>Email</label>
            <p>${userData.email || 'Not specified'}</p>
        </div>
        <div class="info-item">
            <label>Organization</label>
            <p>${userData.organization || 'Not specified'}</p>
        </div>
        <div class="info-item">
            <label>Role</label>
            <p>${userData.role || 'Not specified'}</p>
        </div>
        <div class="info-item">
            <label>City</label>
            <p>${userData.city || 'Not specified'}</p>
        </div>
    `;
}

async function confirmDeleteAccount() {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmed) {
        try {
            // Get user data from localStorage and parse it
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData.id; // Get ID from user object
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8080/api/user/delete${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Clear all local storage data
                localStorage.clear();
                
                // Show success message
                alert('Account deleted successfully');
                
                // Redirect to login page
                window.location.href = '../Login/login.html';
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again later.');
        }
    }
}