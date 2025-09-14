document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');

    let currentPlayer = 'x';
    let isGameOver = false;

    const WINNING_COMBINATIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function startGame() {
        isGameOver = false;
        message.textContent = '';
        currentPlayer = 'x';

        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.textContent = '';
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
    }

    function handleClick(e) {
        const cell = e.target;
        if (isGameOver || cell.classList.contains('x') || cell.classList.contains('o')) return;

        cell.classList.add(currentPlayer);
        cell.textContent = currentPlayer.toUpperCase();

        if (checkWin(currentPlayer)) {
            endGame(`${currentPlayer.toUpperCase()} Wins!`);
        } else if (isDraw()) {
            endGame("It's a Draw!");
        } else {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        }
    }

    function checkWin(player) {
        return WINNING_COMBINATIONS.some(combo => {
            return combo.every(index => {
                return cells[index].classList.contains(player);
            });
        });
    }

    function isDraw() {
        return [...cells].every(cell => {
            return cell.classList.contains('x') || cell.classList.contains('o');
        });
    }

    function endGame(msg) {
        isGameOver = true;
        message.textContent = msg;
    }

    restartBtn.addEventListener('click', startGame);

    startGame();
});
