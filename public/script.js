// Game State
const gameState = {
    clicks: 0,
    weight: 0,
    level: 1,
    clickMultiplier: 1,
    autoFeederInterval: null,
    levels: [
        { name: "Carlos Mom", maxWeight: 200, foodPerClick: 0.1 },
        { name: "Edvine Mom", maxWeight: 700, foodPerClick: 0.5 },
        { name: "Isaac Mom", maxWeight: 5000, foodPerClick: 2 },
        { name: "Klakzon Mom", maxWeight: 100000, foodPerClick: 10 },
        { name: "Bruno Mom", maxWeight: 1000000, foodPerClick: 50 }
    ]
};

// Particle Effect System
function createFoodParticles(x, y) {
    const particleCount = 5;
    const foodEmojis = ['🍔', '🍕', '🌭', '🍟', '🍗'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'food-particle';
        particle.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
}

// Feeding Animation
function animateFeeding() {
    const foodElem = document.querySelector('.food-wrapper');
    const momElem = document.querySelector('.mom-wrapper');

    foodElem.classList.add('feeding');
    setTimeout(() => {
        momElem.classList.add('eating');
        setTimeout(() => {
            foodElem.classList.remove('feeding');
            momElem.classList.remove('eating');
        }, 1000);
    }, 500);
}

// Update Display
function updateDisplay() {
    document.getElementById('current-weight').textContent = gameState.weight.toFixed(1);
    document.getElementById('current-level').textContent = gameState.level;
    document.getElementById('total-clicks').textContent = gameState.clicks;
}

// Check Level Up
function checkLevelUp() {
    const currentLevel = gameState.levels[gameState.level - 1];
    if (gameState.weight >= currentLevel.maxWeight && gameState.level < gameState.levels.length) {
        gameState.level++;

        document.querySelector('.stats-panel').classList.add('level-up');
        setTimeout(() => {
            document.querySelector('.stats-panel').classList.remove('level-up');
        }, 1000);

        alert(`¡Nivel completado! Avanzando al nivel ${gameState.level}`);

        document.getElementById('mom-image').src = `/images/moms/${getMomImage()}`;
        document.getElementById('food-button').src = `/images/food/level${gameState.level}-food.png`;
    }
}

// Get Mom Image
function getMomImage() {
    const moms = ['carlos-mom.png', 'edvine-mom.png', 'isaac-mom.png', 'klakzon-mom.png', 'bruno-mom.png'];
    return moms[gameState.level - 1];
}

// Feed Function
function feed(event) {
    gameState.clicks++;
    const currentLevel = gameState.levels[gameState.level - 1];
    gameState.weight += currentLevel.foodPerClick * gameState.clickMultiplier;

    if (event) {
        const rect = event.target.getBoundingClientRect();
        createFoodParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        animateFeeding();
    }

    updateDisplay();
    checkLevelUp();
}

// Event Listeners
document.getElementById('food-button').addEventListener('click', feed);

// Multiplier Upgrade
document.getElementById('multiplier-upgrade').addEventListener('click', () => {
    if (gameState.clicks >= 100) {
        gameState.clicks -= 100;
        gameState.clickMultiplier *= 1.5;
        alert(`¡Multiplicador mejorado! Ahora es ${gameState.clickMultiplier.toFixed(1)}x`);
        updateDisplay();
    }
});

// Auto Feeder
document.getElementById('auto-feeder').addEventListener('click', () => {
    if (gameState.clicks >= 500 && !gameState.autoFeederInterval) {
        gameState.clicks -= 500;
        gameState.autoFeederInterval = setInterval(() => feed(), 1000);
        document.getElementById('auto-feeder').disabled = true;
        alert('¡Alimentador automático activado!');
        updateDisplay();
    }
});

// Save Progress
setInterval(() => {
    localStorage.setItem('theMomsGameState', JSON.stringify(gameState));
}, 5000);

// Load Saved Progress
const savedState = localStorage.getItem('theMomsGameState');
if (savedState) {
    Object.assign(gameState, JSON.parse(savedState));
    updateDisplay();
    document.getElementById('mom-image').src = `/images/moms/${getMomImage()}`;
    document.getElementById('food-button').src = `/images/food/level${gameState.level}-food.png`;

    if (gameState.autoFeederInterval) {
        gameState.autoFeederInterval = setInterval(() => feed(), 1000);
        document.getElementById('auto-feeder').disabled = true;
    }
}