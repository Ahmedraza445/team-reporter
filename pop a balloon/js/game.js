const checkLevel = () => {
    let level = localStorage.getItem("level");
    return level
}

let level = checkLevel();

const row = document.querySelectorAll(".row")
const container = document.querySelector(".container")
const balls = document.querySelectorAll(".ball")

const swapA = () => {
    setInterval(() => {
        row.forEach(element => {
            element.style.flexDirection = "row"
        });
    }, 2000);
}
const swapAR = () => {
    setInterval(() => {
        row.forEach(element => {
            element.style.flexDirection = "row-reverse"
        });
    }, 3000);
}
const swapB = () => setInterval(() => container.style.flexDirection = "column", 2000);
const swapBR = () => setInterval(() => container.style.flexDirection = "column-reverse", 3000);

const moveB = () => {
    setInterval(() => {
        balls.forEach(element => {
            element.style.height = "85px"
            element.style.width = "85px"
        });
    }, 2000);
}

const moveBR = () => {
    setInterval(() => {
        balls.forEach(element => {
            element.style.height = "120px"
            element.style.width = "120px"
        });
    }, 3000);
}

const moveA = () => {
    setInterval(() => {
        row.forEach(element => {
            element.style.marginTop = "100px";
            element.style.paddingLeft = "50px";
        });
    }, 2000);
}

const moveAR = () => {
    setInterval(() => {
        row.forEach(element => {
            element.style.marginTop = "0px";
            element.style.padding = "0px";
        });
    }, 3000);
}


const setDifficulty = () => {
    if (level == 2 || level == 4 || level > 6) {
        swapA();
        swapB();
    } if (level >= 5) {
        swapAR();
        swapBR();
    } if (level == 4 || level == 6 || level >= 8) {
        moveA();
        moveB();
    } if (level >= 9) {
        moveAR();
        moveBR();
    }
}

let colorToPop, ballsToPop, life;

const coloringBalls = (balls, levelColors) => {
    // coloring balls
    for (let i = 0; i < balls.length; i++) {
        const color = (Math.ceil(Math.random() * levelColors.length)) - 1;
        balls[i].style.backgroundColor = levelColors[color];
        balls[i].style.color = levelColors[color];
        balls[i].classList.add(levelColors[color]);
    }
}

const setHeader = (tellColor, ballsToPop, colorToPop, tellLives, tellLevel) => {
    life = 3
    tellColor.style.color = colorToPop;
    tellColor.textContent = `Pop ${ballsToPop} ${colorToPop} balls to win!`;
    tellLives.textContent = `Lives: ${life}`;
    tellLevel.textContent = `Level: ${level}`;
}

const statusDiv = document.querySelector(".status-div");
const setupGameUI = () => {
    setDifficulty();
    let totalColors = ["red", "green", "blue", "yellow", "orange", "purple", "black", "teal", "brown"], levelColors = Math.ceil(level / 2) + 4, tellColor = document.querySelector(".tell-color"), tellLives = document.querySelector(".tell-lives"), tellLevel = document.querySelector(".tell-level");
    levelColors = totalColors.slice(0, levelColors);
    coloringBalls(balls, levelColors)
    colorToPop = levelColors[(Math.ceil(Math.random() * (levelColors.length - 1)))];
    ballsToPop = document.querySelectorAll(`.${colorToPop}`).length;
    setHeader(tellColor, ballsToPop, colorToPop, tellLives, tellLevel);
    if (ballsToPop == 0) { setupGameUI() }
    startGame();
}

const startGame = () => {
    statusDiv.style.display = "block"
    statusDiv.style.backgroundColor = "white"
    setTimeout(() => {
        statusDiv.style.display = "none"
        statusDiv.innerHTML = '';
    }, 500);
}

const body = document.getElementsByTagName("body")[0]
body.addEventListener("load", setupGameUI())
const checkElementColor = element => {
    element.style.backgroundColor = "white";
    const tellLives = document.querySelector(".tell-lives"), tellColor = document.querySelector(".tell-color");
    if (element.classList.contains(colorToPop) && !element.classList.contains("checked")) { ballsToPop--; }
    else if (!element.classList.contains("checked")) { life--; }
    if (life < 0) { gameFailed(tellLives, statusDiv, body); }
    else if (ballsToPop == 0) { gameWon(tellLives, statusDiv, body, tellColor); }
    else { afterBallPopped(element, tellColor, tellLives); }
}

balls.forEach(ball => ball.addEventListener("mouseenter", e => checkElementColor(e.target)))


const gameFailed = (tellLives, statusDiv, body) => {
    tellLives.textContent = `Failed`;
    statusDiv.style.display = "block";
    statusDiv.innerHTML = 'You Lose!<br><a href="./game.html">Retry <i class="bi bi-arrow-counterclockwise"></i></a>'
    body.style.height = "100vh";
    body.style.overflow = "hidden";
}

const gameWon = (tellLives, statusDiv, body, tellColor) => {
    let score = 5 + (life * 5);
    tellLives.textContent = `Congratulations!`;
    tellColor.textContent = "You Won!"
    statusDiv.style.display = "block";
    statusDiv.innerHTML = `You Won!<br><a href="./game.html">Next <i class="bi bi-arrow-right"></i></a><br><br>Your Score: ${score}`
    body.style.height = "100vh";
    body.style.overflow = "hidden";
    updateScorenLevel(score)
}

const afterBallPopped = (element, tellColor, tellLives) => {
    element.classList.add("checked");
    tellColor.textContent = `Pop ${ballsToPop} ${colorToPop} balls to win`;
    tellLives.textContent = `Lives: ${life}`;
}


const updateScorenLevel = (score) => {
    level++
    setScorenLevel(score, level);
}

const setScorenLevel = (score, userlevel) => {
    if (userlevel <= 10) {
        localStorage.setItem("level", userlevel);
        let user = JSON.parse(localStorage.getItem("currentUser")), passedLevel = userlevel - 1;
        db.collection('users').doc(user.uid).get()
            .then(doc => setDataBase(doc.data(), userlevel, passedLevel, score, user.uid))
            .catch(err => console.log(err.message));
    }
}

const setDataBase = (doc, userlevel, passedLevel, score, userUid) => {
    let userObj = doc;
    userObj.level[passedLevel].score = score;
    if (userlevel <= 10) { userObj.level[userlevel].type = true; }
    db.collection("users").doc(userUid).update(userObj)
        .then(() => {
            console.log("level updated")
            checkLastLevel(passedLevel);
        })
        .catch(err => console.log(err.message));
}

const checkLastLevel = level => {
    if (level == 10) {
        document.querySelector(".congrats-div").style.display = "block";
        body.style.height = "100vh";
        body.style.overflow = "hidden";
    }
}


