let difficulty = 'medium'; // Default difficulty
let obstacleSpeed;
let obstacleFrequency;
let obstacles = [];
let score = 0;
let gameOver = false;
let car;
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Difficulty settings
const difficultySettings = {
  easy: { obstacleSpeed: 2, obstacleFrequency: 3000 },
  medium: { obstacleSpeed: 4, obstacleFrequency: 2000 },
  hard: { obstacleSpeed: 6, obstacleFrequency: 1000 },
};

// Adjust the canvas size based on the window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Select Difficulty Level
document.getElementById('easyButton').addEventListener('click', () => {
  difficulty = 'easy';
  updateGameSettings();
});

document.getElementById('mediumButton').addEventListener('click', () => {
  difficulty = 'medium';
  updateGameSettings();
});

document.getElementById('hardButton').addEventListener('click', () => {
  difficulty = 'hard';
  updateGameSettings();
});

// Update game settings based on selected difficulty
function updateGameSettings() {
  obstacleSpeed = difficultySettings[difficulty].obstacleSpeed;
  obstacleFrequency = difficultySettings[difficulty].obstacleFrequency;
  document.getElementById('easyButton').style.display = 'none';
  document.getElementById('mediumButton').style.display = 'none';
  document.getElementById('hardButton').style.display = 'none';
  document.getElementById('startButton').style.display = 'block';
}

// Show difficulty buttons after game over
function showDifficultyButtons() {
  document.getElementById('easyButton').style.display = 'inline-block';
  document.getElementById('mediumButton').style.display = 'inline-block';
  document.getElementById('hardButton').style.display = 'inline-block';
}

// Start Game
document.getElementById('startButton').addEventListener('click', () => {
  gameOver = false;
  score = 0;
  obstacles = [];
  createCar();
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('restartButton').style.display = 'none';
  setInterval(createObstacle, obstacleFrequency);
  gameLoop();
});

// Restart Game
document.getElementById('restartButton').addEventListener('click', () => {
  gameOver = false;
  score = 0;
  obstacles = [];
  createCar();
  document.getElementById('restartButton').style.display = 'none';
  setInterval(createObstacle, obstacleFrequency);
  gameLoop();
});

// Create car object
function createCar() {
  car = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 60,
    speed: 5,
    movingLeft: false,
    movingRight: false,
  };
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

// Handle key down events for moving the car
function handleKeyDown(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    car.movingLeft = true;
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    car.movingRight = true;
  }
}

// Handle key up events for stopping car movement
function handleKeyUp(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    car.movingLeft = false;
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    car.movingRight = false;
  }
}

// Game Loop
function gameLoop() {
  if (!gameOver) {
    moveCar();
    moveObstacles();
    checkCollisions();
    render();
    requestAnimationFrame(gameLoop);
  } else {
    showGameOver();
    showDifficultyButtons();
  }
}

// Move the car based on key events
function moveCar() {
  if (car.movingLeft && car.x > 0) {
    car.x -= car.speed;
  }
  if (car.movingRight && car.x + car.width < canvas.width) {
    car.x += car.speed;
  }
}

// Create Obstacles
function createObstacle() {
  const width = Math.random() * 50 + 30;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x: x, y: -50, width: width, height: 50 });
}

// Move Obstacles
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacleSpeed;

    // Collision detection
    if (obstacle.y + obstacle.height > canvas.height - car.height &&
        obstacle.x < car.x + car.width &&
        obstacle.x + obstacle.width > car.x) {
      gameOver = true;
    }

    // Remove obstacles off-screen
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score += 10;
    }
  });
}

// Check for collisions
function checkCollisions() {
  obstacles.forEach(obstacle => {
    if (obstacle.y + obstacle.height > canvas.height - car.height &&
        obstacle.x < car.x + car.width &&
        obstacle.x + obstacle.width > car.x) {
      gameOver = true;
    }
  });
}

// Render everything on the canvas
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw car
  ctx.fillStyle = 'red';
  ctx.fillRect(car.x, car.y, car.width, car.height);

  // Draw obstacles
  ctx.fillStyle = 'blue';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Draw score
  document.getElementById('score').innerText = 'Score: ' + score;
}

// Show Game Over
function showGameOver() {
  // Display the game over screen
  alert("Game Over! Your score: " + score);
  document.getElementById('restartButton').style.display = 'block';
}

// Handle window resizing
window.addEventListener('resize', () => {
  resizeCanvas();  // Adjust canvas size on window resize
  if (!gameOver) {
    render();  // Re-render the game
  }
});

// Initialize the game
resizeCanvas();
