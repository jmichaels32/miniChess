// General import
import React, { useState } from 'react';

// Import CSS for constants
import '../styles/constants.css'

// Import move images
import { pieceMove, emptyMove } from './imports.js'

// Import queen SVGs for pawn promotion
import { whiteQueen as whiteQueenSvg, blackQueen as blackQueenSvg } from './imports.js'

// ----------------------------
// Constants Section
// ----------------------------

// JS constants for use throughout the application
export const WHITE = true;
export const BLACK = false;

// Critical Piece
export const CRITICAL = true;

// Piece types
export const KING = 'king'
export const KNIGHT = 'knight'
export const PAWN = 'pawn'
export const BISHOP = 'bishop'
export const ROOK = 'rook'
export const QUEEN = 'queen'

// Zero piece to check for empty board spaces
export const ZEROPIECE = [0, 0, 0, 0, 0]


// ----------------------------
// Function Section
// ----------------------------

// Create a blank state to record the current board position (2D array)
export function createBoard(size) {
	const boardState = new Array(size)
	for (var i = 0; i < size; i++) {
		boardState[i] = new Array(size).fill(ZEROPIECE)
	}
	return boardState
}

// Function to generate a unique ID for the various chess pieces
let counter = 0

export function generateUniqueID() {
	counter += 1

	// The counter should guarantee uniqueness already, but just to be sure use math.random() for additional uniqueness
	return `${Math.floor(Math.random() * 100000000)}-${counter}`
}

// ----------------------------
// Pure Move-Generation Helpers
// ----------------------------

// Deep copy a board (preserves ZEROPIECE identity since we spread rows)
export function cloneBoard(gameState) {
	return gameState.map(row => [...row])
}

// Find the critical piece (king) position for a given owner
export function findKing(owner, gameState) {
	const boardSize = gameState.length
	for (var row = 0; row < boardSize; row++) {
		for (var col = 0; col < boardSize; col++) {
			const piece = gameState[row][col]
			if (piece !== ZEROPIECE && piece[1] === owner && piece[3] === CRITICAL) {
				return [row, col]
			}
		}
	}
	return null
}

// Get pawn attack squares (diagonals regardless of occupancy)
export function getPawnAttacks(position, owner, boardSize) {
	const [row, col] = position
	const direction = owner === BLACK ? 1 : -1
	const newRow = row + direction
	const attacks = []
	if (newRow >= 0 && newRow < boardSize) {
		if (col - 1 >= 0) attacks.push([newRow, col - 1])
		if (col + 1 < boardSize) attacks.push([newRow, col + 1])
	}
	return attacks
}

// Get raw pseudo-legal moves for a piece (returns array of [row, col] pairs)
export function getRawMoves(pieceType, position, owner, gameState, enPassantTarget) {
	const boardSize = gameState.length
	const [row, col] = position
	const moves = []

	if (pieceType === KING) {
		const offsets = [[-1, -1], [-1, 0], [-1, 1],
						 [0, -1],           [0, 1],
						 [1, -1],  [1, 0],  [1, 1]]
		for (var i = 0; i < offsets.length; i++) {
			const nr = row + offsets[i][0]
			const nc = col + offsets[i][1]
			if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
				if (gameState[nr][nc] === ZEROPIECE || gameState[nr][nc][1] !== owner) {
					moves.push([nr, nc])
				}
			}
		}
	} else if (pieceType === KNIGHT) {
		const offsets = [[-2, -1], [-2, 1],
						 [-1, -2], [-1, 2],
						 [1, -2],  [1, 2],
						 [2, -1],  [2, 1]]
		for (var j = 0; j < offsets.length; j++) {
			const nr = row + offsets[j][0]
			const nc = col + offsets[j][1]
			if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
				if (gameState[nr][nc] === ZEROPIECE || gameState[nr][nc][1] !== owner) {
					moves.push([nr, nc])
				}
			}
		}
	} else if (pieceType === PAWN) {
		const direction = owner === BLACK ? 1 : -1
		const newRow = row + direction
		if (newRow >= 0 && newRow < boardSize) {
			// Forward move (only if empty)
			if (gameState[newRow][col] === ZEROPIECE) {
				moves.push([newRow, col])
			}
			// Diagonal captures (only if enemy present or en passant target)
			for (var yOff = -1; yOff <= 1; yOff += 2) {
				const nc = col + yOff
				if (nc >= 0 && nc < boardSize) {
					if (gameState[newRow][nc] !== ZEROPIECE && gameState[newRow][nc][1] !== owner) {
						moves.push([newRow, nc])
					} else if (enPassantTarget && enPassantTarget[0] === newRow && enPassantTarget[1] === nc) {
						moves.push([newRow, nc])
					}
				}
			}
		}
		// Two-square initial move
		const startRow = owner === WHITE ? boardSize - 2 : 1
		if (row === startRow) {
			const oneAhead = row + direction
			const twoAhead = row + direction * 2
			if (twoAhead >= 0 && twoAhead < boardSize &&
				gameState[oneAhead][col] === ZEROPIECE &&
				gameState[twoAhead][col] === ZEROPIECE) {
				moves.push([twoAhead, col])
			}
		}
	} else if (pieceType === BISHOP) {
		const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
		for (var d = 0; d < dirs.length; d++) {
			getRawDiagonalMoves(dirs[d], position, owner, gameState, moves)
		}
	} else if (pieceType === ROOK) {
		const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
		for (var d2 = 0; d2 < dirs.length; d2++) {
			getRawDiagonalMoves(dirs[d2], position, owner, gameState, moves)
		}
	} else if (pieceType === QUEEN) {
		const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
		for (var d3 = 0; d3 < dirs.length; d3++) {
			getRawDiagonalMoves(dirs[d3], position, owner, gameState, moves)
		}
	}

	return moves
}

function getRawDiagonalMoves(direction, position, owner, gameState, moves) {
	const [row, col] = position
	const [dr, dc] = direction
	const boardSize = gameState.length
	var nr = row + dr
	var nc = col + dc
	while (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
		if (gameState[nr][nc] === ZEROPIECE) {
			moves.push([nr, nc])
		} else {
			if (gameState[nr][nc][1] !== owner) {
				moves.push([nr, nc])
			}
			break
		}
		nr += dr
		nc += dc
	}
}

// Get all squares attacked by a given owner
export function getAttackedSquares(owner, gameState) {
	const boardSize = gameState.length
	const attacked = new Set()
	for (var row = 0; row < boardSize; row++) {
		for (var col = 0; col < boardSize; col++) {
			const piece = gameState[row][col]
			if (piece !== ZEROPIECE && piece[1] === owner) {
				if (piece[2] === PAWN) {
					// Pawns attack diagonals regardless of occupancy
					const pawnAttacks = getPawnAttacks([row, col], owner, boardSize)
					for (var p = 0; p < pawnAttacks.length; p++) {
						attacked.add(pawnAttacks[p][0] + ',' + pawnAttacks[p][1])
					}
				} else {
					// For other pieces, get raw moves (which represent attacked squares)
					const pieceMoves = getRawMoves(piece[2], [row, col], owner, gameState, null)
					for (var m = 0; m < pieceMoves.length; m++) {
						attacked.add(pieceMoves[m][0] + ',' + pieceMoves[m][1])
					}
				}
			}
		}
	}
	return attacked
}

// Check if a given owner's king is in check
export function isInCheck(owner, gameState) {
	const kingPos = findKing(owner, gameState)
	if (!kingPos) return false
	const opponent = !owner
	const attacked = getAttackedSquares(opponent, gameState)
	return attacked.has(kingPos[0] + ',' + kingPos[1])
}

// Check if a move is legal (doesn't leave own king in check)
export function isMoveLegal(piece, fromPos, toPos, gameState, enPassantTarget) {
	const cloned = cloneBoard(gameState)
	// Vacate old spot
	cloned[fromPos[0]][fromPos[1]] = ZEROPIECE
	// Place piece on new spot
	cloned[toPos[0]][toPos[1]] = piece

	// Handle en passant capture: if pawn moves diagonally to the en passant target, remove the captured pawn
	if (piece[2] === PAWN && enPassantTarget &&
		toPos[0] === enPassantTarget[0] && toPos[1] === enPassantTarget[1]) {
		// The captured pawn is on the same row as fromPos, same col as toPos
		cloned[fromPos[0]][toPos[1]] = ZEROPIECE
	}

	return !isInCheck(piece[1], cloned)
}

// Count all legal moves for an owner
export function getAllLegalMoves(owner, gameState, enPassantTarget) {
	const boardSize = gameState.length
	var count = 0
	for (var row = 0; row < boardSize; row++) {
		for (var col = 0; col < boardSize; col++) {
			const piece = gameState[row][col]
			if (piece !== ZEROPIECE && piece[1] === owner) {
				const rawMoves = getRawMoves(piece[2], [row, col], owner, gameState, enPassantTarget)
				for (var m = 0; m < rawMoves.length; m++) {
					if (isMoveLegal(piece, [row, col], rawMoves[m], gameState, enPassantTarget)) {
						count++
					}
				}
				// Also count castling moves for king
				if (piece[2] === KING) {
					// Castling moves are handled separately but we need to check if any exist
					// We'll skip counting castling here since we don't have castling rights in this function
					// Castling won't affect checkmate/stalemate detection in practice for mini chess
				}
			}
		}
	}
	return count
}

// Overload that accepts castling rights for more accurate counting
export function getAllLegalMovesWithCastling(owner, gameState, enPassantTarget, castlingRights) {
	const boardSize = gameState.length
	var count = 0
	for (var row = 0; row < boardSize; row++) {
		for (var col = 0; col < boardSize; col++) {
			const piece = gameState[row][col]
			if (piece !== ZEROPIECE && piece[1] === owner) {
				const rawMoves = getRawMoves(piece[2], [row, col], owner, gameState, enPassantTarget)
				for (var m = 0; m < rawMoves.length; m++) {
					if (isMoveLegal(piece, [row, col], rawMoves[m], gameState, enPassantTarget)) {
						count++
					}
				}
				// Count castling moves for king
				if (piece[2] === KING && piece[3] === CRITICAL && castlingRights) {
					const castleMoves = getCastlingMoves(piece, [row, col], gameState, castlingRights)
					count += castleMoves.length
				}
			}
		}
	}
	return count
}

// Get available castling moves for a king
export function getCastlingMoves(kingPiece, kingPos, gameState, castlingRights) {
	const owner = kingPiece[1]
	const rights = castlingRights[owner]
	if (!rights) return []

	const boardSize = gameState.length
	const [kingRow, kingCol] = kingPos
	const moves = []

	// King must not be in check
	if (isInCheck(owner, gameState)) return []

	const opponentAttacked = getAttackedSquares(!owner, gameState)

	// Scan the king's row for rooks of the same color
	for (var col = 0; col < boardSize; col++) {
		if (col === kingCol) continue
		const piece = gameState[kingRow][col]
		if (piece !== ZEROPIECE && piece[1] === owner && piece[2] === ROOK) {
			// Determine if this is king-side or queen-side
			const isKingSide = col > kingCol
			const side = isKingSide ? 'kingSide' : 'queenSide'
			if (!rights[side]) continue

			// Check path is clear between king and rook
			const minCol = Math.min(kingCol, col)
			const maxCol = Math.max(kingCol, col)
			var pathClear = true
			for (var c = minCol + 1; c < maxCol; c++) {
				if (gameState[kingRow][c] !== ZEROPIECE) {
					pathClear = false
					break
				}
			}
			if (!pathClear) continue

			// Determine king's destination (2 squares toward the rook)
			const kingDirection = isKingSide ? 1 : -1
			const kingDest = kingCol + 2 * kingDirection
			const rookDest = kingCol + 1 * kingDirection

			// Make sure king destination is in bounds
			if (kingDest < 0 || kingDest >= boardSize) continue
			if (rookDest < 0 || rookDest >= boardSize) continue

			// Check that the king doesn't pass through or land on attacked squares
			var passesThrough = false
			const step = kingDirection
			for (var sc = kingCol + step; ; sc += step) {
				if (opponentAttacked.has(kingRow + ',' + sc)) {
					passesThrough = true
					break
				}
				if (sc === kingDest) break
			}
			if (passesThrough) continue

			// Valid castling move
			moves.push({
				kingTo: [kingRow, kingDest],
				rookFrom: [kingRow, col],
				rookTo: [kingRow, rookDest]
			})
		}
	}

	return moves
}


// -----------------------------------
// Subsection: Game Mechanics Function
export const Board = ({ gameState,
												changeGameState,
												focusedPiece,
												changeFocusedPiece,
												currentTurn,
												changeCurrentTurn,
												changeWonState,
												isCheck,
												changeCheckState,
												changeDrawState,
												enPassantTarget,
												changeEnPassantTarget,
												castlingRights,
												changeCastlingRights,
												boardSpacing }) => {

	// Declare all states
	const [focusedPiecePosition, changeFocusedPiecePosition] = useState([0, 0])

	return (
		<div>
		  <Pieces
            focusedPiece={focusedPiece}
            changeFocusedPiece={changeFocusedPiece}
            changeFocusedPiecePosition={changeFocusedPiecePosition}
            gameState={gameState}
            isCheck={isCheck}
            currentTurn={currentTurn}
            boardSpacing={boardSpacing}
          />
          <Moves
            focusedPiece={focusedPiece}
            focusedPiecePosition={focusedPiecePosition}
            gameState={gameState}
            changeGameState={changeGameState}
            changeFocusedPiece={changeFocusedPiece}
            currentTurn={currentTurn}
            changeCurrentTurn={changeCurrentTurn}
            changeWonState={changeWonState}
            changeCheckState={changeCheckState}
            changeDrawState={changeDrawState}
            enPassantTarget={enPassantTarget}
            changeEnPassantTarget={changeEnPassantTarget}
            castlingRights={castlingRights}
            changeCastlingRights={changeCastlingRights}
            boardSpacing={boardSpacing}
          />
		</div>
	)
}

const Pieces = ({ focusedPiece,
								  changeFocusedPiece,
								  changeFocusedPiecePosition,
								  gameState,
								  isCheck,
								  currentTurn,
								  boardSpacing }) => {
	const boardSize = gameState.length;
	const pieces = [];

	// Iterate across the board, placing the pieces defined in the game state
	for (var row = 0; row < boardSize; row++) {
		for (var col = 0; col < boardSize; col++) {
			// When the game state isn't zero, place the specified piece
			if (gameState[row][col] !== ZEROPIECE) {
				pieces.push(<Piece
								piece={gameState[row][col]}
								piecePosition={[row, col]}
								focusedPiece={focusedPiece}
								changeFocusedPiece={changeFocusedPiece}
                      			changeFocusedPiecePosition={changeFocusedPiecePosition}
                      			isCheck={isCheck}
                      			currentTurn={currentTurn}
                      			boardSpacing={boardSpacing}
							/>)
			}
		}
	}
	return <div> {pieces} </div>
}

const Moves = ({ focusedPiece,
								 focusedPiecePosition,
								 gameState,
						     changeGameState,
						     changeFocusedPiece,
						     currentTurn,
						     changeCurrentTurn,
						     changeWonState,
						     changeCheckState,
						     changeDrawState,
						     enPassantTarget,
						     changeEnPassantTarget,
						     castlingRights,
						     changeCastlingRights,
						     boardSpacing }) => {
	// If there is no piece selected, there should be no moves
	if (focusedPiece === ZEROPIECE) {
		return null
	}

	// If the select piece isn't owned by the proper player, there should also be no moves
	if (focusedPiece[1] !== currentTurn) {
	    return null
	}

	// Determine the type of the focused piece and determine its move pattern
	if (focusedPiece[2] === KING) {
		return kingMove(focusedPiece,
										focusedPiecePosition,
										gameState,
									  changeGameState,
									  changeFocusedPiece,
									  currentTurn,
									  changeCurrentTurn,
									  changeWonState,
									  changeCheckState,
									  changeDrawState,
									  enPassantTarget,
									  changeEnPassantTarget,
									  castlingRights,
									  changeCastlingRights,
									  boardSpacing)
	} else if (focusedPiece[2] === KNIGHT) {
		return knightMove(focusedPiece,
											focusedPiecePosition,
											gameState,
										  changeGameState,
										  changeFocusedPiece,
										  currentTurn,
										  changeCurrentTurn,
										  changeWonState,
										  changeCheckState,
										  changeDrawState,
										  enPassantTarget,
										  changeEnPassantTarget,
										  castlingRights,
										  changeCastlingRights,
										  boardSpacing)
	} else if (focusedPiece[2] === PAWN) {
		const pieceDirection = focusedPiece[1] // Piece direction is determined by who owns the piece
		return pawnMove(focusedPiece,
										focusedPiecePosition,
										gameState,
									  changeGameState,
									  changeFocusedPiece,
									  currentTurn,
									  changeCurrentTurn,
									  changeWonState,
									  changeCheckState,
									  changeDrawState,
									  enPassantTarget,
									  changeEnPassantTarget,
									  castlingRights,
									  changeCastlingRights,
									  boardSpacing,
									  pieceDirection)
	} else if (focusedPiece[2] === BISHOP) {
		return <div> {bishopMove(focusedPiece,
														 focusedPiecePosition,
														 gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing)} </div>
	} else if (focusedPiece[2] === ROOK) {
		return <div> {rookMove(focusedPiece,
														 focusedPiecePosition,
														 gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing)} </div>
	} else if (focusedPiece[2] === QUEEN) {
		const moves = bishopMove(focusedPiece,
														 focusedPiecePosition,
														 gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing)
		moves.push(rookMove(focusedPiece,
														 focusedPiecePosition,
														 gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing))
		return <div> {moves} </div>
	}
}

// -----------------------------------
// Subsubsection: Individual Chess Components
const Piece = ({ piece,
								 piecePosition,
								 focusedPiece,
								 changeFocusedPiece,
								 changeFocusedPiecePosition,
								 isCheck,
								 currentTurn,
								 boardSpacing }) => {
	const pieceImage = piece[0]
	const [topPosition, leftPosition] = piecePosition

	// Determine background color: selected (yellow), in check king (red), or transparent
	const isKingInCheck = isCheck && piece[3] === CRITICAL && piece[1] === currentTurn
	let bgColor = 'transparent'
	if (focusedPiece === piece) {
		bgColor = getComputedStyle(document.body).getPropertyValue('--selected-piece-background')
	} else if (isKingInCheck) {
		bgColor = getComputedStyle(document.body).getPropertyValue('--red-color')
	}

	// Set the position of the piece
	const pieceStyle = {
		top: `calc(var(${boardSpacing}) * ${topPosition})`,
	    left: `calc(var(${boardSpacing}) * ${leftPosition})`,
    	width: `var(${boardSpacing})`,
    	height: `var(${boardSpacing})`,
	    backgroundColor: bgColor
	}

	function clickPiece() {
		// Change the focused piece
		changeFocusedPiece(piece)
		changeFocusedPiecePosition(piecePosition)
	}

	return (
		<button onClick={clickPiece} className="board-button" style={pieceStyle}>
			<img className="maximize-img" src={pieceImage} alt="Chess Piece"/>
		</button>
	)
}

const Move = ({ piece,
						    piecePosition,
						    newPosition,
						    gameState,
						    changeGameState,
						    changeFocusedPiece,
						    changeCurrentTurn,
						    changeWonState,
						    changeCheckState,
						    changeDrawState,
						    enPassantTarget,
						    changeEnPassantTarget,
						    castlingRights,
						    changeCastlingRights,
						    moveImage,
						    moveAlt,
						    boardSpacing,
						    capturePosition,
						    castleRookFrom,
						    castleRookTo }) => {
	const [oldTopPosition, oldLeftPosition] = piecePosition
	const [topPosition, leftPosition] = newPosition

	const moveStyle = {
		top: `calc(var(${boardSpacing}) * ${topPosition})`,
	    left: `calc(var(${boardSpacing}) * ${leftPosition})`,
    	width: `var(${boardSpacing})`,
    	height: `var(${boardSpacing})`
  }

  function movePiece() {
    // Remember the captured piece
    var capturedPiece = gameState[topPosition][leftPosition]
    const currentTurn = piece[1]
    const boardSize = gameState.length

  	// Vacate the old spot
  	gameState[oldTopPosition][oldLeftPosition] = ZEROPIECE
  	// Update the new spot
    gameState[topPosition][leftPosition] = piece

    // Handle en passant capture
    if (capturePosition) {
    	capturedPiece = gameState[capturePosition[0]][capturePosition[1]]
    	gameState[capturePosition[0]][capturePosition[1]] = ZEROPIECE
    }

    // Handle castling rook movement
    if (castleRookFrom && castleRookTo) {
    	const rook = gameState[castleRookFrom[0]][castleRookFrom[1]]
    	gameState[castleRookFrom[0]][castleRookFrom[1]] = ZEROPIECE
    	gameState[castleRookTo[0]][castleRookTo[1]] = rook
    }

    // Pawn promotion (auto-queen)
    if (piece[2] === PAWN) {
    	const backRank = piece[1] === WHITE ? 0 : boardSize - 1
    	if (topPosition === backRank) {
    		const queenSvg = piece[1] === WHITE ? whiteQueenSvg : blackQueenSvg
    		gameState[topPosition][leftPosition] = [queenSvg, piece[1], QUEEN, !CRITICAL, piece[4]]
    	}
    }

    // Set en passant target
    if (piece[2] === PAWN && Math.abs(topPosition - oldTopPosition) === 2) {
    	// The skipped square
    	const skippedRow = (topPosition + oldTopPosition) / 2
    	changeEnPassantTarget([skippedRow, leftPosition])
    } else {
    	changeEnPassantTarget(null)
    }

    // Update castling rights
    if (castlingRights) {
    	const newRights = {
    		true: { ...castlingRights[true] },
    		false: { ...castlingRights[false] }
    	}
    	// If king moves, revoke both castling rights for that color
    	if (piece[2] === KING && piece[3] === CRITICAL) {
    		newRights[currentTurn].kingSide = false
    		newRights[currentTurn].queenSide = false
    	}
    	// If rook moves from its starting position, revoke the relevant side
    	if (piece[2] === ROOK) {
    		// Determine which side this rook was on
    		const kingPos = findKing(currentTurn, gameState)
    		if (kingPos) {
    			if (oldLeftPosition > kingPos[1]) {
    				newRights[currentTurn].kingSide = false
    			} else {
    				newRights[currentTurn].queenSide = false
    			}
    		}
    	}
    	// If a rook is captured, revoke that side's rights for the opponent
    	if (capturedPiece !== ZEROPIECE && capturedPiece[2] === ROOK) {
    		const capturedOwner = capturedPiece[1]
    		const capturedKingPos = findKing(capturedOwner, gameState)
    		if (capturedKingPos) {
    			if (leftPosition > capturedKingPos[1]) {
    				newRights[capturedOwner].kingSide = false
    			} else {
    				newRights[capturedOwner].queenSide = false
    			}
    		}
    	}
    	changeCastlingRights(newRights)
    }

    // Update the state
    changeGameState([...gameState])
    changeFocusedPiece(ZEROPIECE)

    // Check if we won the game (critical piece captured)
    if (capturedPiece[3] === CRITICAL) {
    	changeWonState([true, currentTurn])
    	changeCheckState(false)
    	return
    }

    // Switch the turns
    const nextTurn = !currentTurn
    changeCurrentTurn(nextTurn)

    // Check if opponent is in check and/or has legal moves
    const opponentInCheck = isInCheck(nextTurn, gameState)
    const opponentLegalMoves = getAllLegalMovesWithCastling(nextTurn, gameState,
    	// The new en passant target for the opponent
    	(piece[2] === PAWN && Math.abs(topPosition - oldTopPosition) === 2)
    		? [(topPosition + oldTopPosition) / 2, leftPosition]
    		: null,
    	castlingRights)

    if (opponentInCheck && opponentLegalMoves === 0) {
    	// Checkmate
    	changeWonState([true, currentTurn])
    	changeCheckState(false)
    } else if (!opponentInCheck && opponentLegalMoves === 0) {
    	// Stalemate
    	changeDrawState(true)
    	changeCheckState(false)
    } else if (opponentInCheck) {
    	changeCheckState(true)
    } else {
    	changeCheckState(false)
    }
  }

  return (
    <button onClick={movePiece} className="board-button move-opacity" style={moveStyle}>
      <img className="maximize-img" src={moveImage} alt={moveAlt}/>
    </button>
  )

}

// -----------------------------------
// Subsubsection: Individual Chess Moves

// Generates move for a particular set of defined positions
function moveToParticularSet(positions,
														 focusedPiece,
													   focusedPiecePosition,
													   gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing) {
	const [currentXPosition, currentYPosition] = focusedPiecePosition
	const boardSize = gameState.length
	const moves = []

	for (var positionIndex = 0; positionIndex < positions.length; positionIndex++) {
		// Parse the current positions
		const newXPosition = currentXPosition + positions[positionIndex][0]
		const newYPosition = currentYPosition + positions[positionIndex][1]

		// Make sure we're in bounds
		if ((newXPosition >= 0 && newXPosition < boardSize) &&
			(newYPosition >= 0 && newYPosition < boardSize)) {
			// Determine if a piece doesnt exist at the specified location
			const pieceDoesntExist = gameState[newXPosition][newYPosition] === ZEROPIECE
			const moveImage = pieceDoesntExist ? emptyMove : pieceMove
			const moveAlt = pieceDoesntExist ? "Empty Move" : "Piece Move"

			// Check if move is legal (doesn't leave king in check)
			var canMove = false
            if (!pieceDoesntExist) {
            	if (gameState[newXPosition][newYPosition][1] !== currentTurn) {
            		canMove = true
            	}
            } else {
            	canMove = true
            }

            if (canMove && isMoveLegal(focusedPiece, focusedPiecePosition, [newXPosition, newYPosition], gameState, enPassantTarget)) {
            	const move = <Move
                      piece={focusedPiece}
                      piecePosition={focusedPiecePosition}
                      newPosition={[newXPosition, newYPosition]}
                      gameState={gameState}
                      changeGameState={changeGameState}
                      changeFocusedPiece={changeFocusedPiece}
                      changeCurrentTurn={changeCurrentTurn}
                      changeWonState={changeWonState}
                      changeCheckState={changeCheckState}
                      changeDrawState={changeDrawState}
                      enPassantTarget={enPassantTarget}
                      changeEnPassantTarget={changeEnPassantTarget}
                      castlingRights={castlingRights}
                      changeCastlingRights={changeCastlingRights}
                      moveImage={moveImage}
                      moveAlt={moveAlt}
                      boardSpacing={boardSpacing}
                   />
            	moves.push(move)
            }
		}
	}

	return <div> {moves} </div>
}

function kingMove(focusedPiece,
								   focusedPiecePosition,
								   gameState,
								   changeGameState,
								   changeFocusedPiece,
								   currentTurn,
								   changeCurrentTurn,
								   changeWonState,
								   changeCheckState,
								   changeDrawState,
								   enPassantTarget,
								   changeEnPassantTarget,
								   castlingRights,
								   changeCastlingRights,
								   boardSpacing) {
	const positions = [[-1, -1], [-1, 0], [-1, 1],
									   [0, -1],           [0, 1],
									   [1, -1],  [1, 0],  [1, 1]]
	const normalMoves = moveToParticularSet(positions,
														 focusedPiece,
													   focusedPiecePosition,
													   gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing)

	// Generate castling moves
	const castleMoveElements = []
	if (focusedPiece[3] === CRITICAL && castlingRights) {
		const castleMoves = getCastlingMoves(focusedPiece, focusedPiecePosition, gameState, castlingRights)
		for (var i = 0; i < castleMoves.length; i++) {
			const cm = castleMoves[i]
			castleMoveElements.push(<Move
				piece={focusedPiece}
				piecePosition={focusedPiecePosition}
				newPosition={cm.kingTo}
				gameState={gameState}
				changeGameState={changeGameState}
				changeFocusedPiece={changeFocusedPiece}
				changeCurrentTurn={changeCurrentTurn}
				changeWonState={changeWonState}
				changeCheckState={changeCheckState}
				changeDrawState={changeDrawState}
				enPassantTarget={enPassantTarget}
				changeEnPassantTarget={changeEnPassantTarget}
				castlingRights={castlingRights}
				changeCastlingRights={changeCastlingRights}
				moveImage={emptyMove}
				moveAlt={"Castle Move"}
				boardSpacing={boardSpacing}
				castleRookFrom={cm.rookFrom}
				castleRookTo={cm.rookTo}
			/>)
		}
	}

	return <div> {normalMoves} {castleMoveElements} </div>
}

function knightMove(focusedPiece,
									  focusedPiecePosition,
									  gameState,
									  changeGameState,
									  changeFocusedPiece,
									  currentTurn,
									  changeCurrentTurn,
									  changeWonState,
									  changeCheckState,
									  changeDrawState,
									  enPassantTarget,
									  changeEnPassantTarget,
									  castlingRights,
									  changeCastlingRights,
									  boardSpacing) {
	const positions = [			[-2, -1], [-2, 1],
									   [-1, -2],           [-1, 2],
									   [1, -2],            [1, 2],
									   			[2, -1], [2, 1]]

	return moveToParticularSet(positions,
														 focusedPiece,
													   focusedPiecePosition,
													   gameState,
													   changeGameState,
													   changeFocusedPiece,
													   currentTurn,
													   changeCurrentTurn,
													   changeWonState,
													   changeCheckState,
													   changeDrawState,
													   enPassantTarget,
													   changeEnPassantTarget,
													   castlingRights,
													   changeCastlingRights,
													   boardSpacing)
}

function pawnMove(focusedPiece,
									focusedPiecePosition,
									gameState,
								  changeGameState,
								  changeFocusedPiece,
								  currentTurn,
								  changeCurrentTurn,
								  changeWonState,
								  changeCheckState,
								  changeDrawState,
								  enPassantTarget,
								  changeEnPassantTarget,
								  castlingRights,
								  changeCastlingRights,
								  boardSpacing,
								  pieceDirection) {
	const [currentXPosition, currentYPosition] = focusedPiecePosition
	const boardSize = gameState.length
	const moves = []

	// Find the "forward" position determined by pawn owner
	const newXPosition = pieceDirection === BLACK ? currentXPosition + 1 : currentXPosition - 1
	// Make sure that we're in bounds
	if (newXPosition >= 0 && newXPosition < boardSize) {
		// -----------
		// Create the move 'forward'
		// -----------

		// Make sure a piece doesn't exist above the pawn
		if (gameState[newXPosition][currentYPosition] === ZEROPIECE) {
			if (isMoveLegal(focusedPiece, focusedPiecePosition, [newXPosition, currentYPosition], gameState, enPassantTarget)) {
				moves.push(<Move
									piece={focusedPiece}
									piecePosition={focusedPiecePosition}
									newPosition={[newXPosition, currentYPosition]}
									gameState={gameState}
	                  changeGameState={changeGameState}
	                  changeFocusedPiece={changeFocusedPiece}
	                  changeCurrentTurn={changeCurrentTurn}
	                  changeWonState={changeWonState}
	                  changeCheckState={changeCheckState}
	                  changeDrawState={changeDrawState}
	                  enPassantTarget={enPassantTarget}
	                  changeEnPassantTarget={changeEnPassantTarget}
	                  castlingRights={castlingRights}
	                  changeCastlingRights={changeCastlingRights}
	                  moveImage={emptyMove}
	                  moveAlt={"Empty Move"}
	                  boardSpacing={boardSpacing}
	                />)
			}
		}

		// -----------
		// Create both the diagonal captures
		// -----------

		for (var yOffset = -1; yOffset <= 1; yOffset += 2) {
			const newYPosition = currentYPosition + yOffset
			// Make sure we're in bounds
			if (newYPosition >= 0 && newYPosition < boardSize) {
				// Regular diagonal capture
				if (gameState[newXPosition][newYPosition] !== ZEROPIECE &&
					gameState[newXPosition][newYPosition][1] !== currentTurn) {
					if (isMoveLegal(focusedPiece, focusedPiecePosition, [newXPosition, newYPosition], gameState, enPassantTarget)) {
						moves.push(<Move
											piece={focusedPiece}
											piecePosition={focusedPiecePosition}
											newPosition={[newXPosition, newYPosition]}
											gameState={gameState}
				                  changeGameState={changeGameState}
				                  changeFocusedPiece={changeFocusedPiece}
				                  changeCurrentTurn={changeCurrentTurn}
				                  changeWonState={changeWonState}
				                  changeCheckState={changeCheckState}
				                  changeDrawState={changeDrawState}
				                  enPassantTarget={enPassantTarget}
				                  changeEnPassantTarget={changeEnPassantTarget}
				                  castlingRights={castlingRights}
				                  changeCastlingRights={changeCastlingRights}
				                  moveImage={pieceMove}
				                  moveAlt={"Piece Move"}
				                  boardSpacing={boardSpacing}
				                />)
					}
				}
				// En passant capture
				else if (enPassantTarget &&
						 enPassantTarget[0] === newXPosition &&
						 enPassantTarget[1] === newYPosition) {
					if (isMoveLegal(focusedPiece, focusedPiecePosition, [newXPosition, newYPosition], gameState, enPassantTarget)) {
						// The captured pawn is on the same row as the moving pawn, same col as the en passant target
						moves.push(<Move
											piece={focusedPiece}
											piecePosition={focusedPiecePosition}
											newPosition={[newXPosition, newYPosition]}
											gameState={gameState}
				                  changeGameState={changeGameState}
				                  changeFocusedPiece={changeFocusedPiece}
				                  changeCurrentTurn={changeCurrentTurn}
				                  changeWonState={changeWonState}
				                  changeCheckState={changeCheckState}
				                  changeDrawState={changeDrawState}
				                  enPassantTarget={enPassantTarget}
				                  changeEnPassantTarget={changeEnPassantTarget}
				                  castlingRights={castlingRights}
				                  changeCastlingRights={changeCastlingRights}
				                  moveImage={pieceMove}
				                  moveAlt={"En Passant Move"}
				                  boardSpacing={boardSpacing}
				                  capturePosition={[currentXPosition, newYPosition]}
				                />)
					}
				}
			}
		}
	}

	// Two-square initial move
	const startRow = pieceDirection === WHITE ? boardSize - 2 : 1
	if (currentXPosition === startRow) {
		const direction = pieceDirection === BLACK ? 1 : -1
		const oneAhead = currentXPosition + direction
		const twoAhead = currentXPosition + direction * 2
		if (twoAhead >= 0 && twoAhead < boardSize &&
			gameState[oneAhead][currentYPosition] === ZEROPIECE &&
			gameState[twoAhead][currentYPosition] === ZEROPIECE) {
			if (isMoveLegal(focusedPiece, focusedPiecePosition, [twoAhead, currentYPosition], gameState, enPassantTarget)) {
				moves.push(<Move
									piece={focusedPiece}
									piecePosition={focusedPiecePosition}
									newPosition={[twoAhead, currentYPosition]}
									gameState={gameState}
	                  changeGameState={changeGameState}
	                  changeFocusedPiece={changeFocusedPiece}
	                  changeCurrentTurn={changeCurrentTurn}
	                  changeWonState={changeWonState}
	                  changeCheckState={changeCheckState}
	                  changeDrawState={changeDrawState}
	                  enPassantTarget={enPassantTarget}
	                  changeEnPassantTarget={changeEnPassantTarget}
	                  castlingRights={castlingRights}
	                  changeCastlingRights={changeCastlingRights}
	                  moveImage={emptyMove}
	                  moveAlt={"Empty Move"}
	                  boardSpacing={boardSpacing}
	                />)
			}
		}
	}

	return <div> {moves} </div>
}

function bishopMove(focusedPiece,
										focusedPiecePosition,
										gameState,
									  changeGameState,
									  changeFocusedPiece,
									  currentTurn,
									  changeCurrentTurn,
									  changeWonState,
									  changeCheckState,
									  changeDrawState,
									  enPassantTarget,
									  changeEnPassantTarget,
									  castlingRights,
									  changeCastlingRights,
									  boardSpacing) {
	const moves = []

	for (var xDirection = -1; xDirection <= 1; xDirection += 2) {
		for (var yDirection = -1; yDirection <= 1; yDirection += 2) {
			moves.push(generateDiagonal([xDirection, yDirection],
																	focusedPiece,
																	focusedPiecePosition,
																	gameState,
																  changeGameState,
																  changeFocusedPiece,
																  currentTurn,
																  changeCurrentTurn,
																  changeWonState,
																  changeCheckState,
																  changeDrawState,
																  enPassantTarget,
																  changeEnPassantTarget,
																  castlingRights,
																  changeCastlingRights,
																  boardSpacing))
		}
	}

	return moves
}

function rookMove(focusedPiece,
									focusedPiecePosition,
									gameState,
								  changeGameState,
								  changeFocusedPiece,
								  currentTurn,
								  changeCurrentTurn,
								  changeWonState,
								  changeCheckState,
								  changeDrawState,
								  enPassantTarget,
								  changeEnPassantTarget,
								  castlingRights,
								  changeCastlingRights,
								  boardSpacing) {
	const moves = []

	for (var xDirection = -1; xDirection <= 1; xDirection += 2) {
		moves.push(generateDiagonal([xDirection, 0],
														focusedPiece,
														focusedPiecePosition,
														gameState,
													  changeGameState,
													  changeFocusedPiece,
													  currentTurn,
													  changeCurrentTurn,
													  changeWonState,
													  changeCheckState,
													  changeDrawState,
													  enPassantTarget,
													  changeEnPassantTarget,
													  castlingRights,
													  changeCastlingRights,
													  boardSpacing))
	}

	for (var yDirection = -1; yDirection <= 1; yDirection += 2) {
		moves.push(generateDiagonal([0, yDirection],
														focusedPiece,
														focusedPiecePosition,
														gameState,
													  changeGameState,
													  changeFocusedPiece,
													  currentTurn,
													  changeCurrentTurn,
													  changeWonState,
													  changeCheckState,
													  changeDrawState,
													  enPassantTarget,
													  changeEnPassantTarget,
													  castlingRights,
													  changeCastlingRights,
													  boardSpacing))
	}

	return moves
}

function generateDiagonal(direction,
													focusedPiece,
													focusedPiecePosition,
													gameState,
												  changeGameState,
												  changeFocusedPiece,
												  currentTurn,
												  changeCurrentTurn,
												  changeWonState,
												  changeCheckState,
												  changeDrawState,
												  enPassantTarget,
												  changeEnPassantTarget,
												  castlingRights,
												  changeCastlingRights,
												  boardSpacing) {
	const [currentXPosition, currentYPosition] = focusedPiecePosition
	const [xDirection, yDirection] = direction
	const boardSize = gameState.length
	const moves = []

	var newXPosition = currentXPosition + xDirection
	var newYPosition = currentYPosition + yDirection

	// While we are in bounds, keep iterating until we find a piece
	while ((newXPosition >= 0 && newXPosition < boardSize) &&
				 (newYPosition >= 0 && newYPosition < boardSize)) {
		const pieceDoesntExist = gameState[newXPosition][newYPosition] === ZEROPIECE
		const moveImage = pieceDoesntExist ? emptyMove : pieceMove
		const moveAlt = pieceDoesntExist ? "Empty Move" : "Piece Move"

		// If a piece does exist at the specified location
    if (!pieceDoesntExist) {
    	// Make sure the piece is owned by the right player
    	if (gameState[newXPosition][newYPosition][1] !== currentTurn) {
    		if (isMoveLegal(focusedPiece, focusedPiecePosition, [newXPosition, newYPosition], gameState, enPassantTarget)) {
    			moves.push(<Move
			                piece={focusedPiece}
			                piecePosition={focusedPiecePosition}
			                newPosition={[newXPosition, newYPosition]}
			                gameState={gameState}
			                changeGameState={changeGameState}
			                changeFocusedPiece={changeFocusedPiece}
			                changeCurrentTurn={changeCurrentTurn}
			                changeWonState={changeWonState}
			                changeCheckState={changeCheckState}
			                changeDrawState={changeDrawState}
			                enPassantTarget={enPassantTarget}
			                changeEnPassantTarget={changeEnPassantTarget}
			                castlingRights={castlingRights}
			                changeCastlingRights={changeCastlingRights}
			                moveImage={moveImage}
			                moveAlt={moveAlt}
			                boardSpacing={boardSpacing}
		               />)
    		}
    	}
    	return moves
    } else {
    	if (isMoveLegal(focusedPiece, focusedPiecePosition, [newXPosition, newYPosition], gameState, enPassantTarget)) {
    		moves.push(<Move
		                piece={focusedPiece}
		                piecePosition={focusedPiecePosition}
		                newPosition={[newXPosition, newYPosition]}
		                gameState={gameState}
		                changeGameState={changeGameState}
		                changeFocusedPiece={changeFocusedPiece}
		                changeCurrentTurn={changeCurrentTurn}
		                changeWonState={changeWonState}
		                changeCheckState={changeCheckState}
		                changeDrawState={changeDrawState}
		                enPassantTarget={enPassantTarget}
		                changeEnPassantTarget={changeEnPassantTarget}
		                castlingRights={castlingRights}
		                changeCastlingRights={changeCastlingRights}
		                moveImage={moveImage}
		                moveAlt={moveAlt}
		                boardSpacing={boardSpacing}
	               />)
    	}
    }

		newXPosition += xDirection
		newYPosition += yDirection
	}

	return moves
}
