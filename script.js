const board = document.getElementById("chessboard");

let initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

let selectedSquare = null;
let currentTurn = "white";
let validMoves = []; // Array of { row, col } objects

function getPieceColor(piece) {
  if ("♙♖♘♗♕♔".includes(piece)) return "white";
  if ("♟♜♞♝♛♚".includes(piece)) return "black";
  return null;
}

function renderBoard() {
  board.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "white" : "black");
      square.setAttribute("data-row", row);
      square.setAttribute("data-col", col);
      square.textContent = initialBoard[row][col];
      if (validMoves.some((m) => m.row === row && m.col === col)) {
        square.classList.add("valid-move");
      }

      if (selectedSquare?.row === row && selectedSquare.col === col) {
        square.style.outline = "2px solid yellow";
      }

      square.addEventListener("click", () => handleSquareClick(row, col));
      board.appendChild(square);
    }
  }
}

function isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
  const direction = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;

  // Forward 1
  if (
    toRow === fromRow + direction &&
    toCol === fromCol &&
    initialBoard[toRow][toCol] === ""
  ) {
    return true;
  }

  // Forward 2
  if (
    fromRow === startRow &&
    toRow === fromRow + 2 * direction &&
    toCol === fromCol &&
    initialBoard[fromRow + direction][toCol] === "" &&
    initialBoard[toRow][toCol] === ""
  ) {
    return true;
  }

  // Diagonal capture
  if (
    toRow === fromRow + direction &&
    Math.abs(toCol - fromCol) === 1 &&
    initialBoard[toRow][toCol] !== "" &&
    getPieceColor(initialBoard[toRow][toCol]) !== color
  ) {
    return true;
  }

  return false;
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
  const dr = Math.abs(toRow - fromRow);
  const dc = Math.abs(toCol - fromCol);
  return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Must move diagonally
  if (rowDiff !== colDiff) return false;

  const rowStep = toRow > fromRow ? 1 : -1;
  const colStep = toCol > fromCol ? 1 : -1;

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  while (r !== toRow && c !== toCol) {
    if (initialBoard[r][c] !== "") return false; // blocked
    r += rowStep;
    c += colStep;
  }

  return true;
}

function isValidRookMove(fromRow, fromCol, toRow, toCol) {
  const isSameRow = fromRow === toRow;
  const isSameCol = fromCol === toCol;

  if (!isSameRow && !isSameCol) return false;

  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  while (r !== toRow || c !== toCol) {
    if (initialBoard[r][c] !== "") return false; // path blocked
    r += rowStep;
    c += colStep;
  }

  return true;
}

function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
  return (
    isValidBishopMove(fromRow, fromCol, toRow, toCol) ||
    isValidRookMove(fromRow, fromCol, toRow, toCol)
  );
}

function isValidKingMove(fromRow, fromCol, toRow, toCol) {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff <= 1 && colDiff <= 1;
}

function handleSquareClick(row, col) {
  const clickedPiece = initialBoard[row][col];
  const clickedColor = getPieceColor(clickedPiece);
  console.log(
    `Clicked ${clickedPiece} at [${row}, ${col}] — Turn: ${currentTurn}`
  );

  if (!selectedSquare) {
    if (clickedPiece !== "" && clickedColor === currentTurn) {
      selectedSquare = { row, col };
      console.log("Re-rendering board...");
      renderBoard();
    }
  } else {
    const from = selectedSquare;
    const piece = initialBoard[from.row][from.col];
    const pieceColor = getPieceColor(piece);
    const target = initialBoard[row][col];
    const targetColor = getPieceColor(target);

    let validMove = false;

    if (piece === "♙" || piece === "♟") {
      validMove = isValidPawnMove(from.row, from.col, row, col, pieceColor);
      console.log("Pawn move validity:", validMove);
    } else if (piece === "♘" || piece === "♞") {
      validMove = isValidKnightMove(from.row, from.col, row, col);
      console.log("Knight move validity:", validMove);
    } else if (piece === "♗" || piece === "♝") {
      validMove = isValidBishopMove(from.row, from.col, row, col);
      console.log("Bishop move validity:", validMove);
    } else if (piece === "♖" || piece === "♜") {
      validMove = isValidRookMove(from.row, from.col, row, col);
      console.log("Rook move validity:", validMove);
    } else if (piece === "♕" || piece === "♛") {
      validMove = isValidQueenMove(from.row, from.col, row, col);
      console.log("Queen move validity:", validMove);
    } else if (piece === "♔" || piece === "♚") {
      validMove = isValidKingMove(from.row, from.col, row, col);
      console.log("King move validity:", validMove);
    }

    if (validMove) {
      initialBoard[from.row][from.col] = "";
      initialBoard[row][col] = piece;
      currentTurn = currentTurn === "white" ? "black" : "white";
    }

    selectedSquare = { row, col };
    validMoves = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r === row && c === col) continue; // skip same square

        let moveValid = false;

        if (piece === "♙" || piece === "♟") {
          moveValid = isValidPawnMove(row, col, r, c, clickedColor);
        } else if (piece === "♘" || piece === "♞") {
          moveValid = isValidKnightMove(row, col, r, c);
        } else if (piece === "♗" || piece === "♝") {
          moveValid = isValidBishopMove(row, col, r, c);
        } else if (piece === "♖" || piece === "♜") {
          moveValid = isValidRookMove(row, col, r, c);
        } else if (piece === "♕" || piece === "♛") {
          moveValid = isValidQueenMove(row, col, r, c);
        } else if (piece === "♔" || piece === "♚") {
          moveValid = isValidKingMove(row, col, r, c);
        }

        const target = initialBoard[r][c];
        const targetColor = getPieceColor(target);

        if (moveValid && targetColor !== clickedColor) {
          validMoves.push({ row: r, col: c });
        }
      }
    }

    console.log("Valid Moves:", validMoves);
    renderBoard();
  }
}

renderBoard();
