const ecoActions = [
    { id: "walk",    name: "Walked or Biked",          icon: "🚶", points: 450 },
    { id: "reusable",name: "Used Reusable Cup/Bottle", icon: "♻️", points: 180 },
    { id: "recycle", name: "Recycled Plastic/Paper",   icon: "🗑️", points: 220 },
    { id: "veggie",  name: "Ate Plant-Based Meal",     icon: "🥦", points: 680 },
    { id: "lights",  name: "Turned Off Lights",        icon: "💡", points: 90 },
    { id: "public",  name: "Used Public Transport",    icon: "🚌", points: 520 }
];


function registerUser(username, email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.email === email)) {
        return { success: false, message: "User with this email already exists!" };
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: "Registration successful!" };
}

function loginUser(email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, message: "Login successful!", user };
    }
    return { success: false, message: "Invalid email or password!" };
}

function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return !!sessionStorage.getItem('currentUser');
}

function renderActions() {
    const grid = document.getElementById('actions-grid');
    if (!grid) return;

    grid.innerHTML = '';

    ecoActions.forEach(action => {
        const card = document.createElement('div');
        card.className = 'action-card';
        card.innerHTML = `
            <div class="action-icon">${action.icon}</div>
            <h3>${action.name}</h3>
            <p class="points">+${action.points}g CO₂</p>
        `;
        
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });

        grid.appendChild(card);
    });
}

function calculateSavings() {
    let total = 0;
    const activeCards = document.querySelectorAll('.action-card.active');

    activeCards.forEach(card => {
        const name = card.querySelector('h3').textContent.trim();
        const action = ecoActions.find(a => a.name === name);
        if (action) total += action.points;
    });

    const result = document.getElementById('result');
    const amount = document.getElementById('savings-amount');
    const message = document.getElementById('message');

    if (!result || !amount) return;

    amount.textContent = total;
    result.style.display = 'block';

    if (total >= 1500) {
        message.textContent = "🌍 Outstanding effort! You're a climate hero!";
    } else if (total >= 800) {
        message.textContent = "Great job! You're making a real difference 🌱";
    } else if (total >= 300) {
        message.textContent = "Good work! Every action matters.";
    } else {
        message.textContent = "Every small step counts. Keep going!";
    }
}

function resetTracker() {
    document.querySelectorAll('.action-card.active').forEach(card => {
        card.classList.remove('active');
    });
    const result = document.getElementById('result');
    if (result) result.style.display = 'none';
}

function updateNavbar() {
    const currentUser = getCurrentUser();
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;

    if (currentUser) {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="tracker.html">Tracker</a>
            <a href="resources.html">Learn</a>
            <span style="margin-left: 2rem; color: #34d399;">
                Hello, ${currentUser.username}
            </span>
            <a href="#" onclick="logoutUser()" style="margin-left: 1.5rem; color: #f87171;">
                Logout
            </a>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="tracker.html">Tracker</a>
            <a href="resources.html">Learn</a>
            <a href="login.html" style="margin-left: 2rem;">Login</a>
            <a href="register.html" class="btn" style="margin-left: 1rem; padding: 8px 20px; font-size: 1rem;">Register</a>
        `;
    }
}


window.addEventListener('load', () => {
    renderActions();     
    updateNavbar();     
});