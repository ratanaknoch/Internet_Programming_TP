      // ==== Some setting values ====
      console.log("Kdmuy mae vea trov tver oy ban!");
   const CANVAS_W = 900;
   const CANVAS_H = 550;
   const BALL_SPEED = 1.5;     // try 1.5–2.5
   const PADDLE_SPEED = 3;   // try 3–5
   const PADDLE_W = 120;     // wider paddle helps beginners
   const PADDLE_H = 12;
   
   let score = 0;
   let running = true;

   // Ball & paddle
   const ball = { x: CANVAS_W/2, y: CANVAS_H/2, r: 10, dx: BALL_SPEED, dy: BALL_SPEED };
   const paddle = { x: CANVAS_W/2 - PADDLE_W/2, y: CANVAS_H - 40, w: PADDLE_W, h: PADDLE_H, speed: PADDLE_SPEED, dx: 0 };
    
   // === We should have Global Variables
   // === to keep all the reference objects. So what are the referenced objects we should have?
   // 1. A canvas constant
   const canvas = document.getElementById('game');
   // 2. A canvas' 2D context constant
   const ctx = canvas.getContext('2d');
   // 3. A score element, so we can update the score
   const scoreEl = document.getElementById('score');
   // 4. A restart button, so we can apply click on it
   const restartBtn = document.getElementById('restart');

   // Ensure canvas matches tunables (if you change in HTML, these still enforce)
   canvas.width = CANVAS_W;
   canvas.height = CANVAS_H;
   
   // === We should define functions as well
   // 1. A function to draw the ball and the paddle - draw() { .... }
   function draw() {
      // Clear screen, to make the canvas blank so we can draw something new on it.
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
      ctx.fillStyle = '#facc15';
      ctx.fill();

      // Paddle
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      
      // If you lose the game, so message game over instead.
      if (!running) {
        ball.x = -300;

        ctx.fillStyle = '#ffffff';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);

        ctx.font = '16px sans-serif';
        ctx.fillText('Click Restart to play again', canvas.width / 2, canvas.height / 2 + 40);
      }
   }

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  }
});

// Detect key up
document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  }
});

// 2. A function to move the paddle left/right - movePaddle() { .... }
function movePaddle() {
   // Make sure paddle stay in the same vertical position
   paddle.dx = 0;
        // If player press down on arrow right, move the paddle to the right
   if (rightPressed) {
      paddle.dx = paddle.speed;
   }
   // If player press down on arrow left, move the paddle to the left
   if (leftPressed) {
      paddle.dx = -paddle.speed;
   }
      // here is how you can move the paddle to the left:          
      // paddle.dx =  paddle.speed;
   
      paddle.x += paddle.dx;

      // clamp, make sure you can't move paddle outside the canvas:
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
   }

   let rightPressed = false;
   let leftPressed = false;
   // 3. A function to move the ball, it bounces when touch the left/top/right wall of canvas - moveBall() { ..... }
   function moveBall() {
      // move ball 
      ball.x += ball.dx;
      ball.y += ball.dy;
      // left/right walls
      if (ball.x - ball.r <= 0) {
         ball.x = ball.r;
         ball.dx *= -1;
      } else if (ball.x + ball.r >= canvas.width) {
         ball.x = canvas.width - ball.r;
         ball.dx *= -1;
      }

      // top wall
      if (ball.y - ball.r <= 0) {
         ball.y = ball.r;
         ball.dy *= -1;
      }

      // bottom wall: if the ball hits the bottom, end the game
      if (ball.y + ball.r >= canvas.height) {
         running = false;
      }
   }
   // Restart button click event
   restartBtn.addEventListener('click', () => {
      init();
   });

   // 4. A function to check collision with the paddle or miss - checkCollision() { .... }
   function checkCollision() {
     const hitsPaddle =
        ball.y + ball.r >= paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w;

      if (hitsPaddle && ball.dy > 0) {
        ball.dy *= -1;
      // slightly increase ball speed on each paddle hit
      const SPEED_INCREMENT = 0.3; // tweak this value to control acceleration
      const curSpeed = Math.hypot(ball.dx, ball.dy);
      if (curSpeed > 0) {
         const newSpeed = curSpeed + SPEED_INCREMENT;
         const scale = newSpeed / curSpeed;
         ball.dx *= scale;
         ball.dy *= scale;
      }
       // small horizontal tweak based on where the ball hit the paddle
       const hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2); // -1..1
       ball.dx += hitPos * 0.6; // adjust horizontal velocity a bit

       // cap total ball speed
       const MAX_SPEED = 6; // tweak this cap as desired
       const speed = Math.hypot(ball.dx, ball.dy);
       if (speed > MAX_SPEED) {
         const scale = MAX_SPEED / speed;
         ball.dx *= scale;
         ball.dy *= scale;
       }
        score++;
        updateUI();
      }

      // Missed paddle
      // if the paddle miss the ball, then                          running = false;
   }
   // 5. A function to update the score - updateUI() { ..... }
   function updateUI() {
      scoreEl.textContent = score;
      // persist and show high score
      const HIGH_SCORE_KEY = 'simpleGameHighScore';
      const stored = localStorage.getItem(HIGH_SCORE_KEY);
      const highScore = stored ? parseInt(stored, 10) : 0;
      if (score > highScore) {
         localStorage.setItem(HIGH_SCORE_KEY, String(score));
      }
      const displayHigh = Math.max(score, highScore);
      scoreEl.textContent = `${score} (Highest Score: ${displayHigh})`;
   }
   
   // === And the loop, to keep the game running
   function init() {
      score = 0; 
      running = true;
      ball.x = CANVAS_W/2; ball.y = CANVAS_H/2; ball.dx = BALL_SPEED; ball.dy = BALL_SPEED;
      paddle.x = CANVAS_W/2 - PADDLE_W/2;
      updateUI();
   }
    
   // === Loop ===
   function loop() {
      if (running) {
        movePaddle();
        moveBall();
        checkCollision();
      }
      draw();
      requestAnimationFrame(loop);
   }

   // So we initialize the value
   init();
   // And then, we start the loop so everything start running!
   loop();  