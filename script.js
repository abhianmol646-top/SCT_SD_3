// ==================================================
// SAMPLE SUDOKU PUZZLE
// ==================================================

const puzzle = [

    [5, 3, 0, 0, 7, 0, 0, 0, 0],

    [6, 0, 0, 1, 9, 5, 0, 0, 0],

    [0, 9, 8, 0, 0, 0, 0, 6, 0],

    [8, 0, 0, 0, 6, 0, 0, 0, 3],

    [4, 0, 0, 8, 0, 3, 0, 0, 1],

    [7, 0, 0, 0, 2, 0, 0, 0, 6],

    [0, 6, 0, 0, 0, 0, 2, 8, 0],

    [0, 0, 0, 4, 1, 9, 0, 0, 5],

    [0, 0, 0, 0, 8, 0, 0, 7, 9]

];


// ==================================================
// DOM ELEMENTS
// ==================================================

const boardElement =
    document.getElementById("board");

const statusElement =
    document.getElementById("status");

const timerElement =
    document.getElementById("timer");

const attemptsElement =
    document.getElementById("attempts");

const emptyElement =
    document.getElementById("empty");


// ==================================================
// VARIABLES
// ==================================================

let attempts = 0;

let seconds = 0;

let timerInterval = null;

let timerStarted = false;


// ==================================================
// CREATE BOARD
// ==================================================

function createBoard() {

    boardElement.innerHTML = "";


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const input =
                document.createElement("input");


            input.classList.add("cell");

            input.type = "text";

            input.maxLength = 2;


            input.dataset.row = row;

            input.dataset.col = col;


            const value =
                puzzle[row][col];


            // GIVEN NUMBER

            if (value !== 0) {

                input.value = value;

                input.readOnly = true;

                input.classList.add("given");

            }


            // USER INPUT

            input.addEventListener(
                "input",
                function () {

                    startTimer();

                    validateInput(this);

                    updateEmptyCount();

                }
            );


            boardElement.appendChild(input);

        }

    }


    updateEmptyCount();

}


// ==================================================
// TIMER
// ==================================================

function startTimer() {

    if (timerStarted) {

        return;

    }


    timerStarted = true;


    timerInterval =
        setInterval(function () {

            seconds++;


            const minutes =
                Math.floor(seconds / 60);


            const secs =
                seconds % 60;


            timerElement.textContent =

                String(minutes)
                    .padStart(2, "0")

                + ":" +

                String(secs)
                    .padStart(2, "0");


        }, 1000);

}


function stopTimer() {

    clearInterval(timerInterval);

}


// ==================================================
// GET BOARD
// ==================================================

function getBoard() {

    const cells =
        document.querySelectorAll(".cell");


    let board = [];


    for (let row = 0; row < 9; row++) {

        board[row] = [];


        for (let col = 0; col < 9; col++) {

            const index =
                row * 9 + col;


            const value =
                cells[index].value;


            if (/^[1-9]$/.test(value)) {

                board[row][col] =
                    parseInt(value);

            } else {

                board[row][col] = 0;

            }

        }

    }


    return board;

}


// ==================================================
// VALIDATE USER INPUT
// ==================================================

function validateInput(cell) {

    const value =
        cell.value;


    // EMPTY INPUT

    if (value === "") {

        cell.classList.remove("wrong");

        statusElement.textContent =
            "Enter a number from 1 to 9.";

        return;

    }


    // INVALID INPUT
    // Alphabet, 0, symbols, 12 etc.

    if (!/^[1-9]$/.test(value)) {

        cell.classList.add("wrong");

        statusElement.textContent =
            "Invalid input! Only numbers 1-9 are allowed.";

        return;

    }


    const row =
        parseInt(cell.dataset.row);


    const col =
        parseInt(cell.dataset.col);


    const num =
        parseInt(value);


    const board =
        getBoard();


    // Remove current number temporarily

    board[row][col] = 0;


    // CHECK SUDOKU RULES

    if (!isValid(
        board,
        row,
        col,
        num
    )) {

        cell.classList.add("wrong");

        statusElement.textContent =
            "Invalid number! Conflict found.";

    }

    else {

        cell.classList.remove("wrong");

        statusElement.textContent =
            "Valid number ✓";

    }

}


// ==================================================
// CHECK NUMBER
// ==================================================

function isValid(
    board,
    row,
    col,
    num
) {


    // CHECK ROW

    for (let x = 0; x < 9; x++) {

        if (board[row][x] === num) {

            return false;

        }

    }


    // CHECK COLUMN

    for (let x = 0; x < 9; x++) {

        if (board[x][col] === num) {

            return false;

        }

    }


    // CHECK 3x3 BOX

    const startRow =
        row - row % 3;


    const startCol =
        col - col % 3;


    for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 3; j++) {

            if (
                board[startRow + i]
                     [startCol + j]
                === num
            ) {

                return false;

            }

        }

    }


    return true;

}


// ==================================================
// FIND EMPTY CELL
// ==================================================

function findEmptyCell(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                return [row, col];

            }

        }

    }


    return null;

}


// ==================================================
// BACKTRACKING ALGORITHM
// ==================================================

function solve(board) {

    const emptyCell =
        findEmptyCell(board);


    // Puzzle solved

    if (emptyCell === null) {

        return true;

    }


    const row =
        emptyCell[0];


    const col =
        emptyCell[1];


    // Try numbers 1-9

    for (let num = 1; num <= 9; num++) {

        attempts++;


        if (
            isValid(
                board,
                row,
                col,
                num
            )
        ) {

            // Place number

            board[row][col] = num;


            // Recursion

            if (solve(board)) {

                return true;

            }


            // BACKTRACK

            board[row][col] = 0;

        }

    }


    return false;

}


// ==================================================
// SOLVE SUDOKU
// ==================================================

function solveSudoku() {

    startTimer();


    const cells =
        document.querySelectorAll(".cell");


    // Check for invalid inputs

    for (const cell of cells) {

        if (
            cell.classList.contains("wrong")
        ) {

            statusElement.textContent =
                "Fix the red cells before solving.";

            return;

        }

    }


    const board =
        getBoard();


    attempts = 0;


    statusElement.textContent =
        "Solving Sudoku...";


    const solved =
        solve(board);


    attemptsElement.textContent =
        attempts;


    if (solved) {

        updateBoard(board);

        stopTimer();

        statusElement.textContent =
            "✓ Sudoku solved successfully!";

    }

    else {

        statusElement.textContent =
            "✕ This Sudoku puzzle has no solution.";

    }

}


// ==================================================
// UPDATE BOARD
// ==================================================

function updateBoard(board) {

    const cells =
        document.querySelectorAll(".cell");


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const index =
                row * 9 + col;


            if (
                !cells[index]
                    .classList
                    .contains("given")
            ) {

                cells[index].value =
                    board[row][col];


                cells[index]
                    .classList
                    .remove("wrong");


                cells[index]
                    .classList
                    .add("solved");

            }

        }

    }


    updateEmptyCount();

}


// ==================================================
// EMPTY CELL COUNT
// ==================================================

function updateEmptyCount() {

    const board =
        getBoard();


    let count = 0;


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                count++;

            }

        }

    }


    emptyElement.textContent =
        count;

}


// ==================================================
// RESET
// ==================================================

function resetBoard() {

    stopTimer();


    seconds = 0;

    timerStarted = false;


    timerElement.textContent =
        "00:00";


    attempts = 0;

    attemptsElement.textContent =
        "0";


    createBoard();


    statusElement.textContent =
        "Puzzle reset successfully.";

}


// ==================================================
// CLEAR
// ==================================================

function clearBoard() {

    stopTimer();


    seconds = 0;

    timerStarted = false;


    timerElement.textContent =
        "00:00";


    attempts = 0;

    attemptsElement.textContent =
        "0";


    const cells =
        document.querySelectorAll(".cell");


    cells.forEach(function (cell) {

        if (
            !cell.classList.contains("given")
        ) {

            cell.value = "";

            cell.classList.remove("wrong");

            cell.classList.remove("solved");

        }

    });


    updateEmptyCount();


    statusElement.textContent =
        "Board cleared. Enter your Sudoku puzzle.";

}


// ==================================================
// INITIALIZE
// ==================================================

createBoard();
