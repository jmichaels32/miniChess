// Import section
import React, { useState } from 'react';

// CSS import
import '../styles/board.css';
import '../styles/global.css'

// Constants import
import { title, smallBoardFunctional, 
         pieceMove, emptyMove, 
         whiteKing, whitePawn,
         blackKing, blackPawn } from '../js/imports.js';
import { createBoard, generateUniqueID } from '../js/constants.js'
import * as Const from '../js/constants.js'

// TODO: ADD RIGHT CLICK DESELECT BUTTON

function initializeThreeByThree(board) {
  // Store as tuple to know:
  //  The SVG representing the piece
  //  Which player owns the piece
  //  The unique ID representing the piece
  board[0][1] = [blackPawn, Const.BLACKTURN, generateUniqueID()];
  board[0][2] = [blackKing, Const.BLACKTURN, generateUniqueID()];
  board[2][0] = [whiteKing, Const.WHITETURN, generateUniqueID()];
  board[2][1] = [whitePawn, Const.WHITETURN, generateUniqueID()];
  return board;
}

const Move = ({ gameState, 
                piece, 
                piecePosition, 
                changeGameState, 
                newPosition, 
                changeFocusedPiece, 
                changeCurrentTurn,
                image,
                alt }) => {
  const [oldTopPosition, oldLeftPosition] = piecePosition;
  const [topPosition, leftPosition] = newPosition;

  const style = {
    top: `calc(var(--small-board-spacing) * ${topPosition})`,
    left: `calc(var(--small-board-spacing) * ${leftPosition})`
  }

  const movePiece = () => {
    gameState[oldTopPosition][oldLeftPosition] = Const.ZEROPIECE
    gameState[topPosition][leftPosition] = piece
    changeGameState(gameState)
    changeFocusedPiece(Const.ZEROPIECE)

    // Switch the turns
    changeCurrentTurn(!piece[1])
  }

  return (
    <button onClick={movePiece} className="piece move" style={style}>
      <img className="piece-move-img" src={image} alt={alt}/>
    </button>
  )
}

const Moves = ({ gameState, changeGameState, focusedPiece, focusedPiecePosition, changeFocusedPiece, currentTurn, changeCurrentTurn }) => {
  // If there is no piece selected, there should be no moves
  if (focusedPiece === Const.ZEROPIECE) {
    return null
  }

  // If the select piece isn't owned by the proper player, there should also be no moves
  if (focusedPiece[1] !== currentTurn) {
    return null
  }

  const moves = []
  const [xPosition, yPosition] = focusedPiecePosition

  // Used focusedPiece to decide which piece has which moves (won't affect 3x3 since all pieces have same moves)

  // Iterate Horizontally
  for (var i = xPosition - 1; i <= xPosition + 1; i++) {
    // Iterate Vertically
    for (var w = yPosition - 1; w <= yPosition + 1; w++) {
      // If we're not the actual element's position
      if (!((i === xPosition) && (w === yPosition))) {
        // Make sure we're not out of bounds
        if ((i >= 0 && i < gameState.length) && (w >= 0 && w < gameState.length)) {
          // If the position is empty, fill it with an empty move
          if (gameState[i][w] === Const.ZEROPIECE) {
            moves.push(<Move 
                          gameState={gameState}
                          piece={focusedPiece}
                          piecePosition={focusedPiecePosition}
                          changeGameState={changeGameState}
                          newPosition={[i, w]}
                          changeFocusedPiece={changeFocusedPiece}
                          changeCurrentTurn={changeCurrentTurn}
                          image={emptyMove}
                          alt={"Empty Move"}
                       />)
          } else {
            // Make sure the piece at the specified position isn't of the same owner (can't capture your own pieces)
            if (gameState[i][w][1] !== currentTurn) {
              moves.push(<Move 
                          gameState={gameState}
                          piece={focusedPiece}
                          piecePosition={focusedPiecePosition}
                          changeGameState={changeGameState}
                          newPosition={[i, w]}
                          changeFocusedPiece={changeFocusedPiece}
                          changeCurrentTurn={changeCurrentTurn}
                          image={pieceMove}
                          alt={"Piece Move"}
                       />)
            }
          }
        }
      }
    }
  }

  return <div> {moves} </div>
}

const ChessPiece = ({ focusedPiece, 
                      changeFocusedPiece, 
                      changeFocusedPiecePosition,
                      piece, 
                      position }) => {
  const pieceImage = piece[0]
  const [topPosition, leftPosition] = position
  
  const style = {
    top: `calc(var(--small-board-spacing) * ${topPosition})`,
    left: `calc(var(--small-board-spacing) * ${leftPosition})`,
    backgroundColor: focusedPiece === piece
      ? getComputedStyle(document.body).getPropertyValue('--selected-piece-background')
      : 'transparent',
  }

  return (
    <button onClick={() => {
      changeFocusedPiece(piece);
      changeFocusedPiecePosition(position);
    }} className="piece" style={style}>
      <img className="piece-move-img" src={pieceImage} alt="Chess Piece"/>
    </button>
    )
}


// Conditionally adds the correct pieces to the board
const CompiledPieces = ({ focusedPiece, changeFocusedPiece, changeFocusedPiecePosition, gameState }) => {
  const pieces = []
  for (var i = 0; i < gameState.length; i++) {
    for (var w = 0; w < gameState.length; w++) {
      if (gameState[i][w] !== Const.ZEROPIECE) {
        pieces.push(<ChessPiece 
                      focusedPiece={focusedPiece}
                      changeFocusedPiece={changeFocusedPiece}
                      changeFocusedPiecePosition={changeFocusedPiecePosition}
                      piece={gameState[i][w]} 
                      position={[i, w]} 
                    />)
      }
    }
  }
  return <div> {pieces} </div>
}

const ThreeByThree = () => {
  const emptyBoard = createBoard(3);
  const initializedBoard = initializeThreeByThree(emptyBoard)
  
  // Declare all states
  const [gameState, changeGameState] = useState(initializedBoard)
  const [focusedPiece, changeFocusedPiece] = useState(Const.ZEROPIECE)
  const [focusedPiecePosition, changeFocusedPiecePosition] = useState([0, 0])
  const [currentTurn, changeCurrentTurn] = useState(Const.WHITETURN)

  const deselectPiece = () => {
    changeFocusedPiece(Const.ZEROPIECE)
  }

  return (
    <div className="board-spacing">
      <div className="text" id="left-button"  onClick={deselectPiece}>
        <button> New game </button>
      </div>
      <div className="game-area">
        <img className="title-secondary" src={title} alt={"miniChess"}/>
        <div className="board-container">
          <img src={smallBoardFunctional} alt={"3x3 Board"}/>
          <CompiledPieces 
            focusedPiece={focusedPiece}
            changeFocusedPiece={changeFocusedPiece}
            changeFocusedPiecePosition={changeFocusedPiecePosition}
            gameState={gameState} 
          />
          <Moves 
            gameState={gameState}
            changeGameState={changeGameState}
            focusedPiece={focusedPiece}
            focusedPiecePosition={focusedPiecePosition}
            changeFocusedPiece={changeFocusedPiece}
            currentTurn={currentTurn}
            changeCurrentTurn={changeCurrentTurn}
            />
        </div>
      </div>
      <div className="text" id="right-button" onClick={deselectPiece}>
        <button> End game </button>
      </div>
    </div>
  )
}

export default ThreeByThree;
