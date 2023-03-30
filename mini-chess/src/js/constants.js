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
// Subsubsection: Individual Chess Components
function kingMove(focusedPiece, 
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

	// Hard code potential positions (makes it easier for granular programming later)
	const positions = [[-1, -1], [-1, 0], [-1, 1], 
					   [0, -1],           [0, 1],
					   [1, -1],  [1, 0],  [1, 1]]
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








