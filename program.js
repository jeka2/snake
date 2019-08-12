var canvas;
var canvasContext;
var x = 200;
var y = 200;
var snackX = 0;
var snackY = 0;
var turningPoints = [];
var traveledLinks = [];
var snackEaten = false;
var changedDirection = false;
var snake = [
    { x: 280, y: 200, dx: 20, dy: 0 },
    { x: 260, y: 200, dx: 20, dy: 0 },
    { x: 240, y: 200, dx: 20, dy: 0 },
    { x: 220, y: 200, dx: 20, dy: 0 },
    { x: 200, y: 200, dx: 20, dy: 0 },
]
var head;
var tail;

window.onload = function () {
    // main canvas
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    createSnack();
    setInterval(gameRun, 500);
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

function checkForEaten() {
    if (head.x === snackX && head.y === snackY) {
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
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.clientWidth, canvas.height);

    snake.forEach(link => {
        for (let i = 0; i < turningPoints.length; i++) {
            turn = turningPoints[i];
            // make it so links that have already traveled that turn
            // cannot be turned there again
            if (link.x === turn.x && link.y === turn.y) {
                link.dx = turn.dx;
                link.dy = turn.dy;

                // once the tail touches the turning point, it needs to 
                // be removed
                if (turn.x === tail.x && turn.y === tail.y) {
                    turningPoints.shift();
                }
                traveledLinks[i].push(link);
            }
        }

        link.x += link.dx;
        link.y += link.dy;
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(link.x, link.y, 19, 19);
    });
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
    var randomX = Math.floor(Math.random() * Math.floor(canvas.width));
    if (xs.includes(randomX) || randomX % 20 != 0) { return checkX(xs); }
    return randomX;
}

function checkY(ys) {
    var randomY = Math.floor(Math.random() * Math.floor(canvas.height));
    if (ys.includes(randomY) || randomY % 20 != 0) { return checkX(ys); }
    return randomY;
}

function gameOver() {
    alert('Game Over');
}

window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 65:
        case 37:
            if (head.dy != 0) {
                head.dx = -20;
                head.dy = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
                traveledLinks.push([]);
            }
            break;
        case 83:
        case 40:
            if (head.dx != 0) {
                head.dy = 20;
                head.dx = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
                traveledLinks.push([]);
            }
            break;
        case 87:
        case 38:
            if (head.dx != 0) {
                head.dy = -20;
                head.dx = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
                traveledLinks.push([]);
            }
            break;
        case 68:
        case 39:
            if (head.dy != 0) {
                head.dx = 20;
                head.dy = 0;
                turningPoints.push({ x: head.x, y: head.y, dx: head.dx, dy: head.dy })
                traveledLinks.push([]);
            }
            break;
    };
});