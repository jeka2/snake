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
var turnToBeRemoved = false;
var newGameOption = false;
var points = document.getElementById('score');

window.onload = function () {
    // main canvas
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    createSnack();
    createSnake();
    setInterval(gameRun, 200);
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
    createBackground();
    if (snackEaten) {
        createSnack();
    }
    else {
        maintainSnack();
    }
    moveSnake();
}

function updateScore() {
    points.innerHTML = `Score: ${++score}`;
}

function checkForEaten() {
    if (head.x === snackX && head.y === snackY) {
        snackEaten = true;
        updateScore();

        let linkBeforeLast = snake[snake.length - 2];
        let directionWorkedWith;
        // The new link addition depends on the link before
        // the tail if snack is eated before the tail turns
        if (linkBeforeLast.dx != tail.dx && linkBeforeLast.dy != tail.dy) {
            directionWorkedWith = linkBeforeLast.dy != 0 ? 'y' : 'x';
            if (directionWorkedWith === 'y') {
                snake.push({ x: tail.x, y: (tail.y - linkBeforeLast.dy), dx: linkBeforeLast.dx, dy: linkBeforeLast.dy })
            }
            else {
                snake.push({ x: (tail.x - linkBeforeLast.dx), y: tail.y, dx: linkBeforeLast.dx, dy: linkBeforeLast.dy })
            }
        }
        else {
            directionWorkedWith = tail.dy != 0 ? 'y' : 'x';
            if (directionWorkedWith === 'y') {
                snake.push({ x: tail.x, y: (tail.y - tail.dy), dx: tail.dx, dy: tail.dy })
            }
            else {
                snake.push({ x: (tail.x - tail.dx), y: tail.y, dx: tail.dx, dy: tail.dy })
            }
        }
    }
}

function checkForLoss() {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
    if (head.x < 0 || head.x > canvas.width - 20 || head.y < 0 || head.y > canvas.height - 20) {
        gameOver();
    }
}

function moveSnake() {
    let deleteFirstTurn = false;
    if (turningPoints[0] != null) {
        if (turningPoints[0].x === tail.x && turningPoints[0].y === tail.y) {
            deleteFirstTurn = true;
        }
    }
    for (let i = 0; i < snake.length; i++) {
        var link = snake[i];
        for (let j = 0; j < turningPoints.length; j++) {
            var turn = turningPoints[j];
            if (link.x === turn.x && link.y === turn.y) {
                // When a link reaches a turning point,
                // it's direction will be changed to the head's direction
                link.dx = turn.dx;
                link.dy = turn.dy;
            }
        }
        link.x += link.dx;
        link.y += link.dy;
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(link.x, link.y, 19, 19);
    }
    if (deleteFirstTurn) {
        turningPoints.shift();
    }
}

function maintainSnack() {
    canvasContext.fillStyle = 'yellow';
    canvasContext.fillRect(snackX, snackY, 19, 19);
}

function createBackground() {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

function createSnack() {
    let min = 1;
    let Xmax = canvas.width / 20 - 1;
    let randomX = Math.floor(Math.random() * (Xmax - min + 1)) + min;
    let Ymax = canvas.height / 20 - 1;
    let randomY = Math.floor(Math.random() * (Ymax - min + 1)) + min;
    randomX *= 20;
    randomY *= 20;
    let superPosition = false;
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === randomX && snake[i].y === randomY) {
            superPosition = true;
            break;
        }
    }

    if (superPosition) { return createSnack(); }
    snackX = randomX;
    snackY = randomY;
    snackEaten = false;

    maintainSnack();
}


function gameOver() {
    alert("Press Space To Go Again!");
    score = -1;
    updateScore();
    turningPoints = [];
    createSnake();
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
                addTurn();
            }
            break;
        case 83:
        case 40:
            if (head.dx != 0) {
                head.dy = 20;
                head.dx = 0;
                addTurn();

            }
            break;
        case 87:
        case 38:
            if (head.dx != 0) {
                head.dy = -20;
                head.dx = 0;
                addTurn();
            }
            break;
        case 68:
        case 39:
            if (head.dy != 0) {
                head.dx = 20;
                head.dy = 0;
                addTurn();
            }
            break;

            // This prevents multiple turns in the span of time
            // the movement refreshes
            function addTurn() {
                if (turningPoints.length === 0 || (turningPoints.length > 0 && !(turningPoints[turningPoints.length - 1].x === head.x && turningPoints[turningPoints.length - 1].y === head.y))) {
                    turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
                }
            }
    };
});