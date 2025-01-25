const gameContainer = document.querySelector(".game-container") 
const toStartContainer = document.querySelector(".to-start-container")
const nextPieceContainer = document.querySelector(".next-piece-container")

// create the main grids
for (let i = 0; i < 19; i++) {
    gameContainer.innerHTML += `
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    `
}

//create grids for the next piece box
for (let i = 0; i < 6; i++) {
    nextPieceContainer.innerHTML += `
    <div class="np-square"></div>
    <div class="np-square"></div>
    <div class="np-square"></div>
    <div class="np-square"></div>
    <div class="np-square"></div>
    <div class="np-square"></div>
    `
}

const grid = document.querySelectorAll(".square")
const nextPieceGrid = document.querySelectorAll(".np-square")

gridIndex = 4;

// *
// *
// *
// *
const iTetrominoes = [
    [gridIndex+30, gridIndex+20, gridIndex+10, gridIndex], //vertical
    [gridIndex-1, gridIndex, gridIndex+1, gridIndex+2] //horizontal
]

//  *
//  *
// **
// 
const jTetrominoes = [
    [gridIndex+21, gridIndex+20, gridIndex+11,gridIndex+1], 
    [gridIndex+11, gridIndex+10, gridIndex+9,gridIndex-1],
    [ gridIndex+20, gridIndex+10, gridIndex+1, gridIndex],
    [gridIndex+11, gridIndex+1, gridIndex, gridIndex-1]
]

// *
// *
// **
// 
const lTetrominoes = [
    [gridIndex+21, gridIndex+20, gridIndex+10, gridIndex], 
    [gridIndex+10, gridIndex+2, gridIndex+1,gridIndex],
    [gridIndex+21, gridIndex+11, gridIndex+1,gridIndex],
    [gridIndex+12, gridIndex+11, gridIndex+10,gridIndex+2]
]


// **
// **
const oTetrominoes = [
    [gridIndex+11, gridIndex+10, gridIndex+1,gridIndex]
]

// **
//  **
const zTetrominoes = [
    [gridIndex+11, gridIndex+10, gridIndex, gridIndex-1], 
    [gridIndex+20, gridIndex+11, gridIndex+10,gridIndex+1]
]

//  **
// **
const sTetrominoes = [
    [gridIndex+11, gridIndex+10, gridIndex+2,gridIndex+1], 
    [gridIndex+21, gridIndex+11, gridIndex+10,gridIndex]
]

//  *
// ***
const tTetrominoes = [
    [gridIndex+11, gridIndex+10, gridIndex+9,gridIndex], 
    [gridIndex+20, gridIndex+11, gridIndex+10,gridIndex],
    [gridIndex+11, gridIndex+2, gridIndex+1,gridIndex],
    [gridIndex+21, gridIndex+11, gridIndex+10,gridIndex+1]
]

const tetrominoes = [iTetrominoes,jTetrominoes,lTetrominoes,oTetrominoes,zTetrominoes,sTetrominoes,tTetrominoes]

const i = [
    [8,14,20,26],
    [19,20,21,22]
]

const j = [
    [15,21,26,27],
    [13,19,20,21],
    [8,9,14,20],
    [14,15,16,22]
]

const l = [
    [14,20,26,27],
    [16,20,21,22],
    [8,9,15,21],
    [13,14,15,19]
]

const o = [
    [14,15,20,21],
]

const z = [
    [13,14,20,21],
    [15,20,21,26]
]

const s = [
    [15,16,20,21],
    [8,14,15,21]
]

const t = [
    [14,19,20,21],
    [8,14,15,20],
    [14,15,16,21],
    [15,20,21,27]
]

const nextPieces = [i,j,l,o,z,s,t]

let intervalID;
let keepShape = false;
let hitEdge = false;
let isPlaying = true;
let score = 0;


let random = Math.floor(Math.random() * 7);
let tetromino = {
    shape: tetrominoes[random],
    currentRotation: Math.floor(Math.random() * tetrominoes[random].length),
    down: 0
};

let nextRandom = Math.floor(Math.random() * 7);
let nextShape = nextPieces[nextRandom];
let nextRotation = Math.floor(Math.random() * nextShape.length);

gameStarted = true;
document.body.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        if (gameStarted) {
            gameStarted = false;
            toStartContainer.innerHTML = `<p class='center-score'>${score}</p>`
            startGame()
        }
    }
})

function startGame() {
    keepShape = false;

    nextShape[nextRotation].forEach(index =>{
        nextPieceGrid[index].style.backgroundColor = "lightBlue"
    })

    const keydownHandler = (event) => handleKeyPress(event, tetromino, keydownHandler);
    // Add the keydown event listener
    document.body.addEventListener("keydown", keydownHandler);

    
    
    // Auto-drop Interval
    draw(tetromino, keydownHandler);
    undraw(tetromino);
    tetromino.down += 10;

    document.body.addEventListener("keydown", event => {
        if (event.key === 'r' || event.key === 'R') location.reload();
    })

    intervalID = setInterval(() => {
        draw(tetromino, keydownHandler);
        if (isPlaying) {
            setTimeout(() => {
                undraw(tetromino);
                tetromino.down += 10;
            }, 500);
        }
        else {
            clearInterval(intervalID)
        }
    }, 503);
}

function stopTetromino(tetromino, keydownHandler){
    const { shape, currentRotation, down } = tetromino;
    
    shape[currentRotation].forEach(idx => {
        grid[idx + down].classList.add("locked");
        grid[idx + down].classList.remove("active");
    });

    checkAndClearRows();

    score += 10;

    toStartContainer.innerHTML = `<p class='center-score'>${score}</p>`
    keepShape = true;

    nextPieceGrid.forEach(index =>{
        if (index.style.backgroundColor = "lightBlue") {
            index.style.backgroundColor = ""
        }
    })
    
    tetromino.shape = tetrominoes[nextRandom];
    tetromino.currentRotation = nextRotation;
    
    nextRandom = Math.floor(Math.random() * 7);
    nextShape = nextPieces[nextRandom];
    nextRotation = Math.floor(Math.random() * nextShape.length);
    tetromino.down = 0;



    clearInterval(intervalID);
    document.body.removeEventListener("keydown", keydownHandler);
    return;
}

function draw(tetromino, keydownHandler) {
    const { shape, currentRotation, down } = tetromino;
    
    for (let i = 0; i < 4; i++) {
        
        let index = shape[currentRotation][i] + down;
        if (index >= 180 || grid[index+10].classList.contains("locked")) {
            stopTetromino(tetromino, keydownHandler);
            if (down <= 0) {
                toStartContainer.innerHTML += "<p>Game Over</p><br><br><p>Click 'R' to Reset</p>"
                isPlaying = false
            }
            else {
                startGame();
            }
            return;
        }
        // Add the active class to the grid
        grid[index].classList.add("active");
    }
    
}


function undraw(tetromino) {
    const { shape, currentRotation, down } = tetromino;

    for (let i = 0; i < 4; i++) {
        let index = shape[currentRotation][i] + down;

        // Ensure the index is within the grid boundaries
        if (index >= 0 && index < grid.length) {
            grid[index].classList.remove("active");
        }
    }
}


function handleKeyPress(event, tetromino, keydownHandler) {
    const { shape, currentRotation, down } = tetromino;

    if (event.key === "w" || event.key === "ArrowUp" && !keepShape) {
        
        if (shape[currentRotation].some(idx => (idx + down+1) % 10 === 0)) {
            undraw(tetromino);
            if (shape == iTetrominoes && currentRotation == 0) tetromino.down--;
            tetromino.currentRotation = (currentRotation + 1) % shape.length;
            tetromino.down--;
            draw(tetromino, keydownHandler);
        }
        if (shape[currentRotation].some(idx => (idx + down) % 10 === 0)) {
            undraw(tetromino);
            tetromino.currentRotation = (currentRotation + 1) % shape.length;
            tetromino.down++;
            draw(tetromino, keydownHandler);
        }
        if (!hitEdge) {
            undraw(tetromino);
            tetromino.currentRotation = (currentRotation + 1) % shape.length;
            draw(tetromino, keydownHandler);
        }
        


    } 
    else if (event.key === "a" || event.key === "ArrowLeft" && !keepShape) {
        undraw(tetromino);

        hitOther = shape[currentRotation].some(idx => grid[idx+down-1].classList.contains("locked"));
        // shape[currentRotation].forEach(index => {
        //     console.log(grid[index+down-1].classList.contains("locked"))
        // })
        hitEdge = shape[currentRotation].some(idx => (idx + down) % 10 === 0);

        
        if (hitOther) {
            draw(tetromino, keydownHandler);
            return;
        }
        if (!hitEdge) tetromino.down -= 1;
        draw(tetromino, keydownHandler);
        return;
    } 
    else if (event.key === "d" || event.key === "ArrowRight" && !keepShape) {
        undraw(tetromino);

        hitOther = shape[currentRotation].some(idx => grid[idx+down+1].classList.contains("locked"));
        // shape[currentRotation].forEach(index => {
        //     console.log(grid[index+down-1].classList.contains("locked"))
        // })
        hitEdge = shape[currentRotation].some(idx => (idx + down + 1) % 10 === 0);

        if (hitOther) {
            draw(tetromino, keydownHandler);
            return;
        }
        if (!hitEdge) tetromino.down += 1;
        draw(tetromino, keydownHandler);
        return;
    } 
    else if (event.key === "s" || event.key === "ArrowDown" && !keepShape) {
        undraw(tetromino);
        tetromino.down += 10;
        draw(tetromino, keydownHandler);
        return;
    }
}


function checkAndClearRows() {
    // Define the number of rows and columns
    const rows = 19; // Total rows
    const cols = 10; // Columns per row

    for (let row = rows - 1; row >= 0; row--) {
        // Check if the current row is completely filled with "locked" elements
        const isRowFull = [...Array(cols)].every((_, col) => {
            const index = row * cols + col;
            return grid[index].classList.contains("locked");
        });

        if (isRowFull) {
            score += 100;
            // Clear the row by removing the "locked" class
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                grid[index].classList.remove("locked");
            }
            
            for (let r = row - 1; r >= 0; r--) {
                for (let col = 0; col < cols; col++) {
                    const index = r * cols + col;

                    if (grid[index].classList.contains("locked")) {
                        grid[index].classList.remove("locked");
                        grid[index+10].classList.add("locked");
                    } else {
                        grid[index+10].classList.remove("locked");
                    }
                }
            }
            // Repeat the process for the same row (in case multiple rows were cleared consecutively)
            row++;
        }
    }
}


