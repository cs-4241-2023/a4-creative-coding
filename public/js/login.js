const googleLoginBtn = document.getElementById('googleLoginBtn');
const cardContainer = document.getElementById('form-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');

// Initialize the Audio object
const loginSound = new Audio('/audio/doorbell.mp3');

async function loginUser(username, password) {
    const response = await fetch('/auth/local', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        return response.json();
    } else {
        const err = await response.json();
        throw new Error(err.error || 'Invalid username or password.');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const data = await loginUser(username, password);
        if (data.success) {
            cardContainer.classList.add('fadeOut'); // Add fade-out animation

            // play audio
            loginSound.play().then(() => {
                console.log('Audio played successfully');
            }).catch(error => {
                console.log('Failed to play audio:', error);
            });

            setTimeout(() => {
                document.location.href = '/expenses.html';
            }, 1000); // Wait for 1s to complete fade-out
        } else {
            alert('Invalid username or password.');
        }
    } catch (error) {
        alert('Invalid username or password.');
    }
}

if (loginForm != null) {
    loginForm.addEventListener('submit', handleLogin);
}

if (googleLoginBtn != null) {
    googleLoginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = '/auth/google';
    });
}