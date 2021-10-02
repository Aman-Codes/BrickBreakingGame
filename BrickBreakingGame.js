let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let ballRadius = 20;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 10;
let dy = -10;
let paddleHeight = 20;
let paddleWidth = 350;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 20;
let brickColumnCount = 8;
let brickWidth = 75;
let brickHeight = 30;
let brickPadding = 10;
let brickOffsetTop = 80;
let brickOffsetLeft = 60;
let score = 0;
let lives = 3;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);  

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } 
    else if (e.keyCode == 37) {
        leftPressed = true;
  }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } 
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert('Congratulations You Won !!!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}  

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#77aa77';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
    );
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
              let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
              let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = '#cb4154';
              ctx.fill();
              ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText('Score: ' + score, 60, 50);
}

function drawLives() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    let str;        
    if(lives==1) {
        ctx.fillText('Life: ' + lives, canvas.width - 200, 50);
        str = "You have only "+ lives + " life left";
    }
    else {
        ctx.fillText('Lives: ' + lives, canvas.width - 200, 50);
        str = "You have only "+ lives + " lives left";
    }        
    document.getElementById("result").innerHTML = str;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection(); 
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } 
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (x - paddleX < paddleWidth / 4) {
                dx = -12;
            }
            else if (x - paddleX < paddleWidth / 2) {
                dx = -8;
            }
            else if(x-paddleX<paddleWidth / 4 * 3) {
                dx = 8;
            }
            else {
                dx = 12;
            }
            dy = -dy;
        } 
        else {
            lives--;
            if (!lives) {
                alert('Oh! You lost the game. Lets make another try ');              
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 10;
                dy = -10;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    } 
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 30;
    } 
    else if (leftPressed && paddleX > 0) {
        paddleX -= 30;
    } 
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}   
draw();
