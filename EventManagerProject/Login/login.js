// Check if user is already logged in
function checkAuthStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        // User is already logged in, redirect to home
        window.location.href = '../Landing/home.html';
    }
}

// Run check when page loads
// checkAuthStatus();

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);

    try {
        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                "userEmail": email,
                "user_password": password
             })
        });

        const data = await response.json();
        alert(data.user_id);

        if (response.ok) {
            const userToStore = {
                id: data.user_id || '54',
                name: data.user_name,
                email: data.userEmail,
                role: data.user_role || '',
                organization: data.organization || '',
                city: data.user_address || ''
            };
            localStorage.setItem('user', JSON.stringify(userToStore));
            
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            window.location.href = '../Landing/home.html';
        } else {
            if (data.error === 'user_not_found') {
                alert('User not found. Please sign up first.');
                window.location.href = '../SignUp/signUp.html';
            } else if (data.error === 'invalid_password') {
                alert('Incorrect password. Please try again.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}