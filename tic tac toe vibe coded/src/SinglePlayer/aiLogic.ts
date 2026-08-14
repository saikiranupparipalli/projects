const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkGameWinner(board: string[]): { winner: string | null; isDraw: boolean } {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], isDraw: false };
    }
  }

  const isDraw = board.every((cell) => cell !== "");
  return { winner: null, isDraw };
}

function getAvailableMoves(board: string[]): number[] {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (cell === "") moves.push(index);
  });
  return moves;
}

interface MinimaxResult {
  score: number;
  move?: number;
}

function minimax(
  board: string[],
  depth: number,
  isMaximizing: boolean,
  aiSymbol: string,
  humanSymbol: string
): MinimaxResult {
  const { winner, isDraw } = checkGameWinner(board);

  if (winner === aiSymbol) return { score: 10 - depth };
  if (winner === humanSymbol) return { score: depth - 10 };
  if (isDraw) return { score: 0 };

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiSymbol;
      const result = minimax(board, depth + 1, false, aiSymbol, humanSymbol);
      board[move] = "";
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanSymbol;
      const result = minimax(board, depth + 1, true, aiSymbol, humanSymbol);
      board[move] = "";
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
    }
    return { score: bestScore, move: bestMove };
  }
}

export function getAIMove(
  board: string[],
  aiSymbol: string = "o",
  humanSymbol: string = "x"
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const result = minimax(board, 0, true, aiSymbol, humanSymbol);
  return result.move !== undefined ? result.move : availableMoves[0];
}
