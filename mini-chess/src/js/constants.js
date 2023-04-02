// General import
import React, { useState } from 'react';

// Import CSS for constants
import '../styles/constants.css'

// Import move images
import { pieceMove, emptyMove } from './imports.js'

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

// -----------------------------------
// Subsection: Game Mechanics Function
export const Board = ({ gameState, 
												changeGameState, 
												focusedPiece, 
												changeFocusedPiece,
												currentTurn,
												changeCurrentTurn,
												changeWonState,
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
            boardSpacing={boardSpacing}
          />
		</div>
	)
}

const Pieces = ({ focusedPiece, 
								  changeFocusedPiece, 
								  changeFocusedPiecePosition, 
								  gameState,
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
						     boardSpacing }) => {
	// If there is no piece selected, there should be no moves
	if (focusedPiece === ZEROPIECE) {
		return null
	}

	// If the select piece isn't owned by the proper player, there should also be no moves
	if (focusedPiece[1] !== currentTurn) {
	    return null
	}

	// TODO: Switch and case
	// TODO: Make function calls smaller?
	// TODO: Make king moves and knight moves more general (i.e. the moves.push idea)

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
													   boardSpacing)
		moves.push(rookMove(focusedPiece, 
														 focusedPiecePosition, 
														 gameState, 
													   changeGameState, 
													   changeFocusedPiece, 
													   currentTurn, 
													   changeCurrentTurn, 
													   changeWonState,
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
								 boardSpacing }) => {
	const pieceImage = piece[0]
	const [topPosition, leftPosition] = piecePosition

	// Set the position of the piece
	const pieceStyle = {
		top: `calc(var(${boardSpacing}) * ${topPosition})`,
	    left: `calc(var(${boardSpacing}) * ${leftPosition})`,
    	width: `var(${boardSpacing})`,
    	height: `var(${boardSpacing})`,
	    backgroundColor: focusedPiece === piece
	      ? getComputedStyle(document.body).getPropertyValue('--selected-piece-background')
	      : 'transparent'
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
						    moveImage, 
						    moveAlt,
						    boardSpacing }) => {
	const [oldTopPosition, oldLeftPosition] = piecePosition
	const [topPosition, leftPosition] = newPosition

	const moveStyle = {
		top: `calc(var(${boardSpacing}) * ${topPosition})`,
	    left: `calc(var(${boardSpacing}) * ${leftPosition})`,
    	width: `var(${boardSpacing})`,
    	height: `var(${boardSpacing})`
  }

  function checkWonGame( capturedPiece, currentTurn ) {
  	if (capturedPiece[3]) {
  		changeWonState([true, currentTurn])
  	}
  }

  function movePiece() {
    // Remember the captured piece
    const capturedPiece = gameState[topPosition][leftPosition]
    const currentTurn = piece[1]

  	// Vacate the old spot
  	gameState[oldTopPosition][oldLeftPosition] = ZEROPIECE
  	// Update the new spot
    gameState[topPosition][leftPosition] = piece

    // Update the state
    changeGameState(gameState)
    changeFocusedPiece(ZEROPIECE)

    // Check if we won the game
    checkWonGame(capturedPiece, currentTurn)

    // Switch the turns
    changeCurrentTurn(!currentTurn)
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

			const move = <Move 
                      piece={focusedPiece}
                      piecePosition={focusedPiecePosition}
                      newPosition={[newXPosition, newYPosition]}
                      gameState={gameState}
                      changeGameState={changeGameState}
                      changeFocusedPiece={changeFocusedPiece}
                      changeCurrentTurn={changeCurrentTurn}
                      changeWonState={changeWonState}
                      moveImage={moveImage}
                      moveAlt={moveAlt}
                      boardSpacing={boardSpacing}
                   />
            // If a piece does exist at the specified location
            if (!pieceDoesntExist) {
            	// Make sure the piece is owned by the right player
            	if (gameState[newXPosition][newYPosition][1] !== currentTurn) {
            		moves.push(move)
            	}
            } else {
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
								   boardSpacing) {
	const positions = [[-1, -1], [-1, 0], [-1, 1], 
									   [0, -1],           [0, 1],
									   [1, -1],  [1, 0],  [1, 1]]
	return moveToParticularSet(positions,
														 focusedPiece, 
													   focusedPiecePosition, 
													   gameState, 
													   changeGameState, 
													   changeFocusedPiece, 
													   currentTurn, 
													   changeCurrentTurn, 
													   changeWonState,
													   boardSpacing)
}

function knightMove(focusedPiece, 
									  focusedPiecePosition, 
									  gameState, 
									  changeGameState, 
									  changeFocusedPiece, 
									  currentTurn, 
									  changeCurrentTurn, 
									  changeWonState,
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
								  boardSpacing,
								  pieceDirection) {
	const [currentXPosition, currentYPosition] = focusedPiecePosition
	const boardSize = gameState.length
	const moves = []

	// Pawn moves are so simple (three positions), it is most clean to hard code positions

	// Find the "forward" position determined by pawn owner
	const newXPosition = pieceDirection === BLACK ? currentXPosition + 1 : currentXPosition - 1
	// Make sure that we're in bounds
	if (newXPosition >= 0 && newXPosition < boardSize) {
		// -----------
		// Create the move 'forward'
		// -----------

		// Make sure a piece doesn't exist above the pawn
		if (gameState[newXPosition][currentYPosition] === ZEROPIECE) {
			moves.push(<Move
										piece={focusedPiece}
										piecePosition={focusedPiecePosition}
										newPosition={[newXPosition, currentYPosition]}
										gameState={gameState}
	                  changeGameState={changeGameState}
	                  changeFocusedPiece={changeFocusedPiece}
	                  changeCurrentTurn={changeCurrentTurn}
	                  changeWonState={changeWonState}
	                  moveImage={emptyMove}
	                  moveAlt={"Empty Move"}
	                  boardSpacing={boardSpacing}
	                />)
		}


		// -----------
		// Create both the diagonal captures
		// -----------

		for (var yOffset = -1; yOffset <= 1; yOffset += 2) {
			const newYPosition = currentYPosition + yOffset
			// Make sure we're in bounds
			if (newYPosition >= 0 && newYPosition < boardSize) {
				// Make sure a piece does exist to create the move
				if (gameState[newXPosition][newYPosition] !== ZEROPIECE) {
					moves.push(<Move
												piece={focusedPiece}
												piecePosition={focusedPiecePosition}
												newPosition={[newXPosition, newYPosition]}
												gameState={gameState}
			                  changeGameState={changeGameState}
			                  changeFocusedPiece={changeFocusedPiece}
			                  changeCurrentTurn={changeCurrentTurn}
			                  changeWonState={changeWonState}
			                  moveImage={pieceMove}
			                  moveAlt={"Piece Move"}
			                  boardSpacing={boardSpacing}
			                />)
				}
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

		const move = <Move 
	                piece={focusedPiece}
	                piecePosition={focusedPiecePosition}
	                newPosition={[newXPosition, newYPosition]}
	                gameState={gameState}
	                changeGameState={changeGameState}
	                changeFocusedPiece={changeFocusedPiece}
	                changeCurrentTurn={changeCurrentTurn}
	                changeWonState={changeWonState}
	                moveImage={moveImage}
	                moveAlt={moveAlt}
	                boardSpacing={boardSpacing}
               />

		// If a piece does exist at the specified location
    if (!pieceDoesntExist) {
    	// Make sure the piece is owned by the right player
    	if (gameState[newXPosition][newYPosition][1] !== currentTurn) {
    		moves.push(move)
    	}
    	return moves
    } else {
    	moves.push(move)
    }

		newXPosition += xDirection
		newYPosition += yDirection
	}

	return moves
}




