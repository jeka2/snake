var canvas;
var canvasContext;
var snackX = 0;
var snackY = 0;
var turningPoints = [];
var snackEaten = false;
var snake = [];
var head;
var tail;
var score = 0;

window.onload = function () {
    // main canvas
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    createSnake();
    createSnack();
    setInterval(gameRun, 500);
}

function createSnake() {
    snake = [
        { x: canvas.width / 2 + 40, y: canvas.height / 2, dx: 20, dy: 0 },
        { x: canvas.width / 2 + 20, y: canvas.height / 2, dx: 20, dy: 0 },
        { x: canvas.width / 2, y: canvas.height / 2, dx: 20, dy: 0 },
        { x: canvas.width / 2 - 20, y: canvas.height / 2, dx: 20, dy: 0 },
        { x: canvas.width / 2 - 40, y: canvas.height / 2, dx: 20, dy: 0 },
    ]
}

function gameRun() {
    head = snake[0];
    tail = snake[snake.length - 1];

    checkForLoss();
    checkForEaten();
    moveSnake();
    if (snackEaten) {
        createSnack();
    }
    else {
        maintainSnack();
    }
}

function increaseScore() {
    score++;
    let points = document.getElementById('score');
    points.innerHTML = `Score: ${score}`;
}

function checkForEaten() {
    if (head.x === snackX && head.y === snackY) {
        increaseScore();

        snackEaten = true;
        var directionWorkedWith = tail.dy != 0 ? 'y' : 'x';
        if (directionWorkedWith === 'y') {
            snake.push({ x: tail.x, y: (tail.y - tail.dy), dx: tail.dx, dy: tail.dy })
        }
        else {
            snake.push({ x: (tail.x - tail.dx), y: tail.y, dx: tail.dx, dy: tail.dy })
        }
    }
    else { snackEaten = false; }
}

function checkForLoss() {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
    }
}

function moveSnake() {
    let turnToBeRemoved = false;
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.clientWidth, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        var link = snake[i];
        for (let j = 0; j < turningPoints.length; j++) {
            var turn = turningPoints[j];
            if (link.x === turn.x && link.y === turn.y) {
                // The problem is here.
                // The tail doesn't get the message that it needs to 
                // Change direction
                link.dx = turn.dx;
                link.dy = turn.dy;

                // once the tail touches the turning point, the point
                // needs to be removed
                if (turn.x === tail.x && turn.y === tail.y) {
                    turnToBeRemoved = true;
                }
            }
        }

        link.x += link.dx;
        link.y += link.dy;
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(link.x, link.y, 19, 19);
    }
    if (turnToBeRemoved) { turningPoints.shift(); }
}

function maintainSnack() {
    canvasContext.fillStyle = 'yellow';
    canvasContext.fillRect(snackX, snackY, 19, 19);
}

function createSnack() {
    var xs = [];
    var ys = [];
    snake.forEach(link => {
        xs.push(link.x);
        ys.push(link.y);
    });
    var snackPoint = checkSpace(xs, ys);

    snackX = snackPoint[0];
    snackY = snackPoint[1];
    snackEaten = false;
    maintainSnack();
}

function checkSpace(xs, ys) {
    var x = checkX(xs);
    var y = checkY(ys);

    return [x, y];
}

function checkX(xs) {
    let min = 1;
    let max = canvas.width / 20;
    var randomX = Math.floor(Math.random() * (max - min + 1)) + min;
    randomX *= 20;
    if (xs.includes(randomX)) { return checkX(xs); }
    return randomX;
}

function checkY(ys) {
    let min = 1;
    let max = canvas.height / 20;
    var randomY = Math.floor(Math.random() * (max - min + 1)) + min;
    randomY *= 20;
    if (ys.includes(randomY)) { return checkY(ys); }
    return randomY;
}

function gameOver() {
    console.log('game over');
}

window.addEventListener("keydown", (e) => {
    // The cases create a turning point on the grid by which
    // all the snake pieces have to abide. So if the point says
    // that the snake went in the positive x direction, every
    // link following the head will have its direction changed likewise
    switch (e.keyCode) {
        case 65:
        case 37:
            if (head.dy != 0) {
                head.dx = -20;
                head.dy = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
            }
            break;
        case 83:
        case 40:
            if (head.dx != 0) {
                head.dy = 20;
                head.dx = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
            }
            break;
        case 87:
        case 38:
            if (head.dx != 0) {
                head.dy = -20;
                head.dx = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
            }
            break;
        case 68:
        case 39:
            if (head.dy != 0) {
                head.dx = 20;
                head.dy = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
            }
            break;
    };
});