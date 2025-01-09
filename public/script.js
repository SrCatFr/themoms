let playerName = '';

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

// Función para iniciar el juego
function startGame() {
    playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Por favor ingresa un nombre');
        return;
    }
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('player-display').textContent = playerName;
    
    // Cargar progreso guardado
    loadProgress();
    // Iniciar actualización automática del leaderboard
    updateLeaderboard();
    setInterval(updateLeaderboard, 10000);
}

// Función para actualizar el leaderboard
async function updateLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaders = await response.json();
        
        const leaderboardHtml = leaders.map((player, index) => `
            <div class="leader-entry">
                ${index + 1}. ${player.name}: ${player.weight.toFixed(1)} kg
            </div>
        `).join('');
        
        document.getElementById('leaderboard-list').innerHTML = leaderboardHtml;
    } catch (error) {
        console.error('Error al actualizar leaderboard:', error);
    }
}

// Función para guardar progreso
async function saveProgress() {
    try {
        await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playerName,
                weight: gameState.weight,
                level: gameState.level
            })
        });
    } catch (error) {
        console.error('Error al guardar progreso:', error);
    }
}

// Función para cargar progreso
async function loadProgress() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaders = await response.json();
        const playerProgress = leaders.find(p => p.name === playerName);
        
        if (playerProgress) {
            gameState.weight = playerProgress.weight;
            gameState.level = playerProgress.level;
            updateDisplay();
            document.getElementById('mom-image').src = `/images/moms/${getMomImage()}`;
            document.getElementById('food-button').src = `/images/food/level${gameState.level}-food.png`;
        }
    } catch (error) {
        console.error('Error al cargar progreso:', error);
    }
}

function updateDisplay() {
    document.getElementById('current-weight').textContent = gameState.weight.toFixed(1);
    document.getElementById('current-level').textContent = gameState.level;
    saveProgress(); // Guardar progreso cada vez que se actualiza
}

function feed() {
    if (!playerName) return;
    
    const currentLevel = gameState.levels[gameState.level - 1];
    gameState.weight += currentLevel.foodPerClick * gameState.clickMultiplier;
    updateDisplay();
    checkLevelUp();
}

function checkLevelUp() {
    const currentLevel = gameState.levels[gameState.level - 1];
    if (gameState.weight >= currentLevel.maxWeight && gameState.level < gameState.levels.length) {
        gameState.level++;
        alert(`¡Nivel completado! Avanzando al nivel ${gameState.level}`);
        document.getElementById('mom-image').src = `/images/moms/${getMomImage()}`;
        document.getElementById('food-button').src = `/images/food/level${gameState.level}-food.png`;
    }
}

function getMomImage() {
    const moms = ['carlos-mom.png', 'edvine-mom.png', 'isaac-mom.png', 'klakzon-mom.png', 'bruno-mom.png'];
    return moms[gameState.level - 1];
}

// Event Listeners
document.getElementById('food-button').addEventListener('click', feed);
