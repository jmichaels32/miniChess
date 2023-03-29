// JS constants for use throughout the application
export const WHITETURN = 0;
export const BLACKTURN = 1;

// Zero piece to check for empty board spaces
export const ZEROPIECE = [0, 0, 0]

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