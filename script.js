const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_COLOR = "#fff";
const BALL_COLOR = "#ff5757";
const NET_COLOR = "#888";

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6;
let ballSpeedY = 4;
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener("mousemove", function(evt) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle within canvas
  if (playerY < 0) playerY = 0;
  if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  let netWidth = 4;
  let netHeight = 24;
  for (let i = 0; i < canvas.height; i += 32) {
    drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight, NET_COLOR);
  }
}

function drawScore() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(playerScore, canvas.width / 4, 40);
  ctx.fillText(aiScore, (3 * canvas.width) / 4, 40);
}

// Collision detection
function collision(ballX, ballY, paddleX, paddleY) {
  return ballX - BALL_RADIUS < paddleX + PADDLE_WIDTH &&
         ballX + BALL_RADIUS > paddleX &&
         ballY + BALL_RADIUS > paddleY &&
         ballY - BALL_RADIUS < paddleY + PADDLE_HEIGHT;
}

// AI movement
function moveAI() {
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY - 35) {
    aiY += 5;
  } else if (aiCenter > ballY + 35) {
    aiY -= 5;
  }
  // Clamp paddle within canvas
  if (aiY < 0) aiY = 0;
  if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Reset the ball to center after scoring
function resetBall(direction) {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = direction * 6;
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Main game loop
function gameLoop() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision (top and bottom)
  if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Paddle collision (player)
  if (collision(ballX, ballY, PLAYER_X, playerY)) {
    ballSpeedX = -ballSpeedX;
    // Add a bit of "spin" depending on where the ball hits the paddle
    let deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
    ballSpeedY = deltaY * 0.2;
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS; // Prevent getting stuck
  }
  // Paddle collision (AI)
  if (collision(ballX, ballY, AI_X, aiY)) {
    ballSpeedX = -ballSpeedX;
    let deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
    ballSpeedY = deltaY * 0.2;
    ballX = AI_X - BALL_RADIUS; // Prevent getting stuck
  }

  // Score update
  if (ballX - BALL_RADIUS < 0) {
    aiScore++;
    resetBall(1);
  } else if (ballX + BALL_RADIUS > canvas.width) {
    playerScore++;
    resetBall(-1);
  }

  // Move AI paddle
  moveAI();

  // Draw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawScore();
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
  drawCircle(ballX, ballY, BALL_RADIUS, BALL_COLOR);

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
