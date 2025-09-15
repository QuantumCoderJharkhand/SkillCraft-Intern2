document.addEventListener("DOMContentLoaded", () => {
  const message = document.getElementById('message');
  const restartBtn = document.getElementById('restartBtn');
  const pvpBtn = document.getElementById('pvpBtn');
  const aiBtn = document.getElementById('aiBtn');

  let currentPlayer = 'x';
  let isGameOver = false;
  let isAgainstAI = false;

  const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function startGame() {
    isGameOver = false;
    currentPlayer = 'x';
    message.textContent = '';

    // reset cells visually
    const cells = document.querySelectorAll('[data-cell]');
    cells.forEach(cell => {
      cell.classList.remove('x', 'o');
      cell.textContent = '';
    });

    // bind click handlers fresh (use once:true so a clicked cell won't be clickable again)
    bindCellListeners();
  }

  function bindCellListeners() {
    const cells = document.querySelectorAll('[data-cell]');
    // remove any previous listeners by setting onclick to null (safe)
    cells.forEach(cell => {
      cell.onclick = null;
      try { cell.removeEventListener('click', handleClick); } catch (e) {}
      cell.addEventListener('click', handleClick, { once: true });
    });
  }

  function handleClick(e) {
    if (isGameOver) return;
    const cell = e.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;

    playMove(cell, currentPlayer);

    if (checkWin(currentPlayer)) {
      endGame(`${currentPlayer.toUpperCase()} Wins!`);
      return;
    }

    if (isDraw()) {
      endGame("It's a Draw!");
      return;
    }

    // switch player
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';

    // if AI mode and now O's turn, let AI play
    if (isAgainstAI && currentPlayer === 'o') {
      setTimeout(() => {
        aiMove();
      }, 350);
    }
  }

  function playMove(cell, player) {
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;
    cell.classList.add(player);
    cell.textContent = player.toUpperCase();
  }

  function aiMove() {
    if (isGameOver) return;
    const cells = Array.from(document.querySelectorAll('[data-cell]'));
    const empty = cells.filter(c => !c.classList.contains('x') && !c.classList.contains('o'));
    if (empty.length === 0) return;

    const choice = empty[Math.floor(Math.random() * empty.length)];
    playMove(choice, 'o');

    if (checkWin('o')) {
      endGame("O Wins!");
      return;
    }

    if (isDraw()) {
      endGame("It's a Draw!");
      return;
    }

    currentPlayer = 'x';
  }

  function checkWin(player) {
    const cells = document.querySelectorAll('[data-cell]');
    return WINNING_COMBINATIONS.some(combo => {
      return combo.every(index => cells[index].classList.contains(player));
    });
  }

  function isDraw() {
    const cells = document.querySelectorAll('[data-cell]');
    return Array.from(cells).every(cell => cell.classList.contains('x') || cell.classList.contains('o'));
  }

  function endGame(msg) {
    isGameOver = true;
    message.textContent = msg;

    // remove remaining click listeners to be safe
    const cells = document.querySelectorAll('[data-cell]');
    cells.forEach(cell => {
      try { cell.removeEventListener('click', handleClick); } catch (e) {}
    });
  }

  // UI bindings
  restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
  });

  pvpBtn.addEventListener('click', () => {
    isAgainstAI = false;
    pvpBtn.classList.add('active');
    aiBtn.classList.remove('active');
    startGame();
  });

  aiBtn.addEventListener('click', () => {
    isAgainstAI = true;
    aiBtn.classList.add('active');
    pvpBtn.classList.remove('active');
    startGame();
  });

  // default
  pvpBtn.classList.add('active');
  startGame();
});

