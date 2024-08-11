document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game');
    const checkSolutionBtn = document.getElementById('check-solution');
    const saveGameBtn = document.getElementById('save-game');
    const loadGameBtn = document.getElementById('load-game');
    const numberPad = document.getElementById('number-pad');
    const eraseBtn = document.getElementById('erase');
    const timerDisplay = document.getElementById('timer');
    const difficultyDisplay = document.getElementById('difficulty');
    const difficultySelect = document.getElementById('difficulty-select');
    const hintButton = document.getElementById('hint-button');
    const hintsLeftDisplay = document.getElementById('hints-left');

    let puzzle = [];
    let solution = [];
    let timer;
    let seconds = 0;
    let difficulty = 'medium';
    let hintsLeft = 3;

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
        const cellsToRemove = getDifficultyCellsToRemove();
        const indexes = shuffle([...Array(81).keys()]);

        for (let i = 0; i < cellsToRemove; i++) {
            puzzle[indexes[i]] = 0;
        }
    }

    function getDifficultyCellsToRemove() {
        switch (difficulty) {
            case 'easy': return 30;
            case 'medium': return 40;
            case 'hard': return 50;
            default: return 40;
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
            cell.classList.remove('correct', 'incorrect', 'hint');
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
        updateDifficultyDisplay();
        resetHints();
    }

    function handleNumberInput(number) {
        const selectedCell = document.querySelector('.selected');
        if (!selectedCell || selectedCell.classList.contains('initial')) return;

        selectedCell.textContent = number;
        selectedCell.classList.remove('correct', 'incorrect', 'hint');
    }

    function handleErase() {
        const selectedCell = document.querySelector('.selected');
        if (!selectedCell || selectedCell.classList.contains('initial')) return;

        selectedCell.textContent = '';
        selectedCell.classList.remove('correct', 'incorrect', 'hint');
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

    function updateDifficultyDisplay() {
        difficultyDisplay.textContent = `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
    }

    function saveGame() {
        const gameState = {
            puzzle,
            solution,
            seconds,
            difficulty,
            hintsLeft
        };
        localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
        alert('Game saved successfully!');
    }

    function loadGame() {
        const savedState = localStorage.getItem('sudokuGameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            puzzle = gameState.puzzle;
            solution = gameState.solution;
            seconds = gameState.seconds;
            difficulty = gameState.difficulty;
            hintsLeft = gameState.hintsLeft;

            displayPuzzle();
            resetTimer();
            startTimer();
            updateDifficultyDisplay();
            updateHintsLeft();
            difficultySelect.value = difficulty;

            alert('Game loaded successfully!');
        } else {
            alert('No saved game found.');
        }
    }

    function getHint() {
        if (hintsLeft > 0) {
            const emptyCells = Array.from(document.querySelectorAll('.cell')).filter(cell => !cell.textContent && !cell.classList.contains('initial'));
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const index = parseInt(randomCell.dataset.index);
                randomCell.textContent = solution[index];
                randomCell.classList.add('hint');
                hintsLeft--;
                updateHintsLeft();
            } else {
                alert('No empty cells left to provide a hint!');
            }
        } else {
            alert('No hints left!');
        }
    }

    function resetHints() {
        hintsLeft = 3;
        updateHintsLeft();
    }

    function updateHintsLeft() {
        hintsLeftDisplay.textContent = `Hints left: ${hintsLeft}`;
    }

    function changeDifficulty() {
        difficulty = difficultySelect.value;
        updateDifficultyDisplay();
        initGame();
    }

    newGameBtn.addEventListener('click', initGame);
    checkSolutionBtn.addEventListener('click', checkSolution);
    saveGameBtn.addEventListener('click', saveGame);
    loadGameBtn.addEventListener('click', loadGame);
    hintButton.addEventListener('click', getHint);
    difficultySelect.addEventListener('change', changeDifficulty);

    numberPad.addEventListener('click', (e) => {
        if (e.target.classList.contains('number')) {
            handleNumberInput(e.target.dataset.number);
        }
    });

    eraseBtn.addEventListener('click', handleErase);

    initGame();
});