// Import CSS for constants
import '../styles/constants.css'

// ----------------------------
// Constants Section
// ----------------------------

// JS constants for use throughout the application
export const WHITETURN = true;
export const BLACKTURN = false;

// Zero piece to check for empty board spaces
export const ZEROPIECE = [0, 0, 0]

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
export const Pieces = ({ focusedPiece, 
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

// -----------------------------------
// Subsubsection: Individual Chess Components
export const Piece = ({ piece, 
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

export const Move = ({ piece,
					   piecePosition, 
					   newPosition, 
					   gameState, 
					   changeGameState, 
					   changeFocusedPiece, 
					   changeCurrentTurn, 
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

  function movePiece() {
  	// Vacate the old spot
  	gameState[oldTopPosition][oldLeftPosition] = ZEROPIECE
  	// Update the new spot
    gameState[topPosition][leftPosition] = piece

    // Update the state
    changeGameState(gameState)
    changeFocusedPiece(ZEROPIECE)

    // Switch the turns
    changeCurrentTurn(!piece[1])
  }

  return (
    <button onClick={movePiece} className="board-button move-opacity" style={moveStyle}>
      <img className="maximize-img" src={moveImage} alt={moveAlt}/>
    </button>
  )

}







