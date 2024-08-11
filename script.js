document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game');
    const checkSolutionBtn = document.getElementById('check-solution');

    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            board.appendChild(cell);
        }
    }

    function initGame() {
        createBoard();
        // TODO: Generate Sudoku puzzle
    }

    newGameBtn.addEventListener('click', initGame);
    checkSolutionBtn.addEventListener('click', () => {
        // TODO: Implement solution checking
        console.log('Checking solution...');
    });

    initGame();
});