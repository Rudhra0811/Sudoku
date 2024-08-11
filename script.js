document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game');
    const checkSolutionBtn = document.getElementById('check-solution');

    let puzzle = [];
    let solution = [];

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
        // Initialize arrays
        puzzle = Array(81).fill(0);
        solution = Array(81).fill(0);

        // Generate solution
        generateSolution(0);

        // Create puzzle by removing numbers
        createPuzzleFromSolution();

        // Display puzzle
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
        // Check row
        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (board[i * 9 + col] === num) return false;
        }

        // Check 3x3 box
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
        const cellsToRemove = 40; // Adjust difficulty by changing this number
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
    }

    function handleKeyPress(e) {
        const selectedCell = document.querySelector('.selected');
        if (!selectedCell || selectedCell.classList.contains('initial')) return;

        const key = e.key;
        if (key >= '1' && key <= '9') {
            selectedCell.textContent = key;
        } else if (key === 'Backspace' || key === 'Delete') {
            selectedCell.textContent = '';
        }
    }

    newGameBtn.addEventListener('click', initGame);
    checkSolutionBtn.addEventListener('click', () => {
        // TODO: Implement solution checking
        console.log('Checking solution...');
    });

    document.addEventListener('keydown', handleKeyPress);

    initGame();
});