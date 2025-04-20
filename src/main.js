import './style.css';

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 3;
const POWERUP_COUNT = 10;
const POWERUP_SIZE = 30;
const SPEED_BOOST = 0.2;
const POINTS_PER_POWERUP = 10;
const SPRITE_GRID_SIZE = 4; // 4x4 grid
const SPRITE_SIZE = 192; // 192x192 pixels per sprite
const PLAYER_SIZE = 96; // Display size of player

// Game state
const gameState = {
  player: {
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    y: GAME_HEIGHT / 2 - PLAYER_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    speed: PLAYER_SPEED,
    direction: 'down',
    frameX: 0,
    frameY: 2, // Default down direction uses down-facing sprite (row 2)
    moving: false
  },
  powerups: [],
  score: 0,
  gameActive: false,
  gameOver: false,
  keys: {}
};

// DOM elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');

// Set canvas dimensions
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Create game screens
function createScreens() {
  // Start screen
  const startScreen = document.createElement('div');
  startScreen.id = 'start-screen';
  startScreen.className = 'screen';
  startScreen.innerHTML = `
    <h1 class="screen-title">Love the Kitty Adventure</h1>
    <img src="./game/images/Love the Kitty Running.png" alt="Love the Kitty" class="screen-icon">
    <div>
      <img src="./game/images/arrow-keys.svg" alt="Arrow Keys" class="game-icon">
      <img src="./game/images/space-key.svg" alt="Space Bar" class="game-icon">
    </div>
  `;

  // Game over screen
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'game-over-screen';
  gameOverScreen.className = 'screen hidden';
  gameOverScreen.innerHTML = `
    <h1 class="screen-title">Game Over</h1>
    <div id="final-score">Score: 0</div>
    <img src="./game/images/space-key.svg" alt="Space Bar" class="game-icon">
  `;

  // Add screens to the game container
  const gameContainer = document.getElementById('game-container');
  gameContainer.appendChild(startScreen);
  gameContainer.appendChild(gameOverScreen);
}

// Load game assets
function loadAssets() {
  // Load player sprite
  gameState.playerSprite = new Image();
  gameState.playerSprite.src = './game/images/Love the Kitty Running.png';

  // Load powerup sprite
  gameState.powerupSprite = new Image();
  gameState.powerupSprite.src = './game/images/powerup.svg';
}

// Generate powerups
function generatePowerups() {
  gameState.powerups = [];
  for (let i = 0; i < POWERUP_COUNT; i++) {
    gameState.powerups.push({
      x: Math.random() * (GAME_WIDTH - POWERUP_SIZE),
      y: Math.random() * (GAME_HEIGHT - POWERUP_SIZE),
      width: POWERUP_SIZE,
      height: POWERUP_SIZE,
      collected: false
    });
  }
}

// Handle keyboard input
function setupControls() {
  window.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;

    // Start or restart game with spacebar
    if (e.key === ' ' || e.code === 'Space') {
      if (!gameState.gameActive) {
        startGame();
      } else if (gameState.gameOver) {
        restartGame();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
  });
}

// Start the game
function startGame() {
  const startScreen = document.getElementById('start-screen');
  startScreen.classList.add('hidden');

  gameState.gameActive = true;
  gameState.gameOver = false;
  gameState.score = 0;
  gameState.player.speed = PLAYER_SPEED;
  gameState.player.x = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
  gameState.player.y = GAME_HEIGHT / 2 - PLAYER_SIZE / 2;
  gameState.player.frameX = 0;
  gameState.player.frameY = 2; // Default down direction uses down-facing sprite (row 2)

  generatePowerups();
  updateScore();
}

// Restart the game
function restartGame() {
  const gameOverScreen = document.getElementById('game-over-screen');
  gameOverScreen.classList.add('hidden');

  gameState.gameActive = true;
  gameState.gameOver = false;
  gameState.score = 0;
  gameState.player.speed = PLAYER_SPEED;
  gameState.player.x = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
  gameState.player.y = GAME_HEIGHT / 2 - PLAYER_SIZE / 2;
  gameState.player.frameX = 0;
  gameState.player.frameY = 2; // Default down direction uses down-facing sprite (row 2)

  generatePowerups();
  updateScore();
}

// End the game
function endGame() {
  gameState.gameActive = false;
  gameState.gameOver = true;

  const gameOverScreen = document.getElementById('game-over-screen');
  const finalScore = document.getElementById('final-score');
  finalScore.textContent = `Score: ${gameState.score}`;
  gameOverScreen.classList.remove('hidden');
}

// Update the score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// Check for collisions between player and powerups
function checkCollisions() {
  gameState.powerups.forEach((powerup, index) => {
    if (!powerup.collected) {
      const dx = gameState.player.x + gameState.player.width / 2 - (powerup.x + powerup.width / 2);
      const dy = gameState.player.y + gameState.player.height / 2 - (powerup.y + powerup.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < gameState.player.width / 2 + powerup.width / 2) {
        // Collect powerup
        powerup.collected = true;
        gameState.score += POINTS_PER_POWERUP;
        gameState.player.speed += SPEED_BOOST;
        updateScore();

        // Check if all powerups are collected
        if (gameState.powerups.every(p => p.collected)) {
          endGame();
        }
      }
    }
  });
}

// Animation frame counter and speed control
let frameCount = 0;
const FRAME_DELAY = 5; // Update animation every 5 frames

// Update player position based on input
function updatePlayer() {
  gameState.player.moving = false;

  if (gameState.keys['ArrowUp'] || gameState.keys['w']) {
    gameState.player.y -= gameState.player.speed;
    gameState.player.frameY = 0; // Up direction uses up-facing sprite (row 0)
    gameState.player.moving = true;
    gameState.player.direction = 'up';
  }
  if (gameState.keys['ArrowDown'] || gameState.keys['s']) {
    gameState.player.y += gameState.player.speed;
    gameState.player.frameY = 2; // Down direction uses down-facing sprite (row 2)
    gameState.player.moving = true;
    gameState.player.direction = 'down';
  }
  if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
    gameState.player.x -= gameState.player.speed;
    gameState.player.frameY = 3; // Left direction uses left-facing sprite (row 3)
    gameState.player.moving = true;
    gameState.player.direction = 'left';
  }
  if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
    gameState.player.x += gameState.player.speed;
    gameState.player.frameY = 1; // Right direction uses right-facing sprite (row 1)
    gameState.player.moving = true;
    gameState.player.direction = 'right';
  }

  // Keep player within bounds
  if (gameState.player.x < 0) gameState.player.x = 0;
  if (gameState.player.x > GAME_WIDTH - gameState.player.width) {
    gameState.player.x = GAME_WIDTH - gameState.player.width;
  }
  if (gameState.player.y < 0) gameState.player.y = 0;
  if (gameState.player.y > GAME_HEIGHT - gameState.player.height) {
    gameState.player.y = GAME_HEIGHT - gameState.player.height;
  }

  // Update animation frame at a controlled rate
  frameCount++;
  if (gameState.player.moving && frameCount >= FRAME_DELAY) {
    gameState.player.frameX = (gameState.player.frameX + 1) % SPRITE_GRID_SIZE;
    frameCount = 0;
  }
}

// Draw the game
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw powerups
  gameState.powerups.forEach(powerup => {
    if (!powerup.collected) {
      ctx.drawImage(
        gameState.powerupSprite,
        powerup.x,
        powerup.y,
        powerup.width,
        powerup.height
      );
    }
  });

  // Draw player
  ctx.drawImage(
    gameState.playerSprite,
    gameState.player.frameX * SPRITE_SIZE,
    gameState.player.frameY * SPRITE_SIZE,
    SPRITE_SIZE,
    SPRITE_SIZE,
    gameState.player.x,
    gameState.player.y,
    gameState.player.width,
    gameState.player.height
  );
}

// Game loop
function gameLoop() {
  if (gameState.gameActive && !gameState.gameOver) {
    updatePlayer();
    checkCollisions();
    draw();
  }

  requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {
  createScreens();
  loadAssets();
  setupControls();
  gameLoop();
}

// Start the game when assets are loaded
window.onload = init;
