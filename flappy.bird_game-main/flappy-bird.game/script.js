// Доска
let board;
let boardWidth = 480; 
let boardHeight = 720; 
let context;

// Птица
let birdWidth = 35;
let birdHeight = 30;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Трубы
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;

let topPipeImg;
let bottomPipeImg;

// Физика
let velocityX = -6; 
let velocityY = 0; 
let gravity = 0.3; 
let jumpStrength = -5;

let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./Images/flappybird.png"; 

    topPipeImg = new Image();
    topPipeImg.src = "./Images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Images/bottompipe.png"; 

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);

    createDifficultyMenu();
};

// Меню выбора сложности
function createDifficultyMenu() {
    const menu = document.createElement("div");
    menu.style.position = "absolute";
    menu.style.top = "50%";
    menu.style.left = "50%";
    menu.style.transform = "translate(-50%, -50%)";
    menu.style.textAlign = "center";
    menu.style.zIndex = "10";

    const title = document.createElement("h2");
    title.innerText = "Выберите уровень сложности:";
    menu.appendChild(title);

    const levels = ["easy", "normal", "hard"];
    levels.forEach(level => {
        const button = document.createElement("button");
        button.innerText = level.charAt(0).toUpperCase() + level.slice(1);
        button.style.margin = "5px";
        button.style.padding = "10px 20px";
        button.style.fontSize = "20px";
        button.style.color = "white";
        button.style.backgroundColor = "#4CAF50"; 
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.transition = "background-color 0.3s";

        button.onmouseover = () => {
            button.style.backgroundColor = "#45a049";
        };

        button.onmouseout = () => {
            button.style.backgroundColor = "#4CAF50";
        };

        button.onclick = () => {
            setDifficulty(level);
            document.body.removeChild(menu);
        };
        menu.appendChild(button);
    });

    document.body.appendChild(menu);
}

// Настройка сложности
function setDifficulty(level) {
    switch (level) {
        case 'easy':
            velocityX = -4;
            gravity = 0.1;
            jumpStrength = -5;
            break;
        case 'normal':
            velocityX = -4.5; 
            gravity = 0.22; 
            jumpStrength = -6; 
            break;
        case 'hard':
            velocityX = -5.5; 
            gravity = 0.28; 
            jumpStrength = -7; 
            break;
    }
}

// Обновление игры
function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true; 
        return;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true; 
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("ИГРА ОКОНЧЕНА", 5, 90);
        if (score > highScore) {
            highScore = score;
        }
        context.fillText(`Рекорд: ${highScore}`, 5, 140);
    }
}

// Размещение труб
function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = Math.floor(Math.random() * (boardHeight - pipeHeight - 100)) + 50;
    let openingSpace = 145;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY - pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

// Движение птицы
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = jumpStrength;

        if (gameOver) {
            restartGame();
        }
    }
}

// Перезапуск игры
function restartGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    velocityY = 0;
}

// Проверка столкновения
function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
