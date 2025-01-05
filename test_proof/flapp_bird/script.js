const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Bird
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
let birdX = 50;
let birdY = HEIGHT / 2;
let birdVelocity = 0;
const BIRD_JUMP = -6;
const GRAVITY = 0.25;

// Pipes
const PIPE_WIDTH = 52;
const PIPE_HEIGHT = 320;
const PIPE_GAP = 150;
const PIPE_SPACING = 200;
const PIPE_VELOCITY = -2;

let pipes = [];
function generatePipe() {
    const y = Math.floor(Math.random() * (-PIPE_HEIGHT + 100));
    return {
        top: {
            x: WIDTH,
            y: y,
            width: PIPE_WIDTH,
            height: PIPE_HEIGHT
        },
        bottom: {
            x: WIDTH,
            y: y + PIPE_HEIGHT + PIPE_GAP,
            width: PIPE_WIDTH,
            height: PIPE_HEIGHT
        }
    };
}

function resetPipes() {
    pipes = [];
    for (let i = 0; i < 3; i++) {
        const pipe = generatePipe();
        pipe.top.x += i * PIPE_SPACING;
        pipe.bottom.x += i * PIPE_SPACING;
        pipes.push(pipe);
    }
}
resetPipes();

// Ground
const GROUND_HEIGHT = 50;
const GROUND_Y = HEIGHT - GROUND_HEIGHT;
let groundX = 0;

// Game state
let gameOver = false;
let score = 0;


function drawScore(score) {
    scoreDisplay.textContent = `Score: ${score}`;
}

function drawBird() {
    ctx.fillStyle = 'yellow'; // Bird color
    ctx.beginPath();
    ctx.ellipse(birdX + BIRD_WIDTH/2, birdY + BIRD_HEIGHT/2, BIRD_WIDTH/2, BIRD_HEIGHT/2, 0, 0, 2 * Math.PI);
    ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = 'green' // Pipe color
    for (const pipe of pipes) {
      ctx.fillRect(pipe.top.x, pipe.top.y, pipe.top.width, pipe.top.height);
      ctx.fillRect(pipe.bottom.x, pipe.bottom.y, pipe.bottom.width, pipe.bottom.height);
    }
}

function drawGround() {
  ctx.fillStyle = 'brown'
  ctx.fillRect(groundX, GROUND_Y, WIDTH, GROUND_HEIGHT)
  ctx.fillRect(groundX + WIDTH, GROUND_Y, WIDTH, GROUND_HEIGHT)
}

function checkCollision() {
    const birdRect = {x: birdX, y: birdY, width: BIRD_WIDTH, height: BIRD_HEIGHT};

    if (birdRect.y + birdRect.height >= GROUND_Y) return true;
  
      for (const pipe of pipes) {
          const topPipeRect = {
            x: pipe.top.x,
            y: pipe.top.y,
            width: pipe.top.width,
            height: pipe.top.height
          }
          const bottomPipeRect = {
            x: pipe.bottom.x,
            y: pipe.bottom.y,
            width: pipe.bottom.width,
            height: pipe.bottom.height
          }
  
          if (rectsOverlap(birdRect, topPipeRect) || rectsOverlap(birdRect, bottomPipeRect)) {
            return true;
          }
      }
      return false;
}

function rectsOverlap(rect1, rect2) {
  return (rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y);
}


function displayGameOver() {
    gameOverDisplay.classList.remove('hidden');
    finalScoreDisplay.textContent = `Final Score: ${score}`;
}

function resetGame() {
    birdY = HEIGHT / 2;
    birdVelocity = 0;
    resetPipes();
    gameOver = false;
    score = 0;
    gameOverDisplay.classList.add('hidden');
    drawScore(score);
    animate();
}


function updatePipes() {
  for(const pipe of pipes) {
    pipe.top.x += PIPE_VELOCITY;
    pipe.bottom.x += PIPE_VELOCITY;
  }

  if(pipes[0].top.x < -PIPE_WIDTH) {
    pipes.shift()
    const newPipe = generatePipe()
    newPipe.top.x += (pipes.length) * PIPE_SPACING
    newPipe.bottom.x += (pipes.length) * PIPE_SPACING
    pipes.push(newPipe)
    score += 1
  }
}

function updateGround() {
  groundX -= 2;
  if(groundX <= -WIDTH){
    groundX = 0;
  }
}


function animate() {
    if (!gameOver) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear canvas

        // Bird
        birdVelocity += GRAVITY;
        birdY += birdVelocity;
        drawBird();

        // Pipes
        updatePipes();
        drawPipes();
        // Ground
        updateGround();
        drawGround();

        // Collision
        if (checkCollision()) {
          gameOver = true;
          displayGameOver();
        }

        // Score
        drawScore(score);

        requestAnimationFrame(animate);
    }
}

// Event listeners
canvas.addEventListener('click', () => {
    if (!gameOver) {
        birdVelocity = BIRD_JUMP;
    }
});

restartButton.addEventListener('click', resetGame);

// Start the game
animate();