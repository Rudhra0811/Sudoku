document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game');
    const checkSolutionBtn = document.getElementById('check-solution');
    const numberPad = document.getElementById('number-pad');
    const eraseBtn = document.getElementById('erase');
    const timerDisplay = document.getElementById('timer');

    let puzzle = [];
    let solution = [];
    let timer;
    let seconds = 0;

    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => selectCell(cell));
            board.appendChild(cell);
        }
    }

    function selectCell(cell) {
        const selectedCell = document.querySelector('.selected');
        if (selectedCell) selectedCell.classList.remove('selected');
        cell.classList.add('selected');
    }

    function generatePuzzle() {
        puzzle = Array(81).fill(0);
        solution = Array(81).fill(0);
        generateSolution(0);
        createPuzzleFromSolution();
        displayPuzzle();
    }

    function generateSolution(index) {
        if (index === 81) return true;

        const row = Math.floor(index / 9);
        const col = index % 9;
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
            if (isValid(solution, row, col, num)) {
                solution[index] = num;
                if (generateSolution(index + 1)) return true;
                solution[index] = 0;
            }
        }

        return false;
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num) return false;
            if (board[i * 9 + col] === num) return false;
        }

        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[(boxRow + i) * 9 + (boxCol + j)] === num) return false;
            }
        }

        return true;
    }

    function createPuzzleFromSolution() {
        const cellsToRemove = 40;
        const indexes = shuffle([...Array(81).keys()]);

        for (let i = 0; i < cellsToRemove; i++) {
            puzzle[indexes[i]] = 0;
        }
    }

    function displayPuzzle() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            if (puzzle[index] !== 0) {
                cell.textContent = puzzle[index];
                cell.classList.add('initial');
            } else {
                cell.textContent = '';
                cell.classList.remove('initial');
            }
            cell.classList.remove('correct', 'incorrect');
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initGame() {
        createBoard();
        generatePuzzle();
        resetTimer();
        startTimer();
    }

    function handleNumberInput(number) {
        const selectedCell = document.querySelector('.selected');
        if (!selectedCell || selectedCell.classList.contains('initial')) return;

        selectedCell.textContent = number;
        selectedCell.classList.remove('correct', 'incorrect');
    }

    function handleErase() {
        const selectedCell = document.querySelector('.selected');
        if (!selectedCell || selectedCell.classList.contains('initial')) return;

        selectedCell.textContent = '';
        selectedCell.classList.remove('correct', 'incorrect');
    }

    function checkSolution() {
        const cells = document.querySelectorAll('.cell');
        let allCorrect = true;

        cells.forEach((cell, index) => {
            const value = cell.textContent;
            if (value === '') {
                allCorrect = false;
                cell.classList.add('incorrect');
            } else if (parseInt(value) === solution[index]) {
                cell.classList.add('correct');
                cell.classList.remove('incorrect');
            } else {
                allCorrect = false;
                cell.classList.add('incorrect');
                cell.classList.remove('correct');
            }
        });

        if (allCorrect) {
            stopTimer();
            alert(`Congratulations! You solved the puzzle in ${formatTime(seconds)}`);
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `Time: ${formatTime(seconds)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        timerDisplay.textContent = 'Time: 00:00';
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    newGameBtn.addEventListener('click', initGame);
    checkSolutionBtn.addEventListener('click', checkSolution);

    numberPad.addEventListener('click', (e) => {
        if (e.target.classList.contains('number')) {
            handleNumberInput(e.target.dataset.number);
        }
    });

    eraseBtn.addEventListener('click', handleErase);

    initGame();
});