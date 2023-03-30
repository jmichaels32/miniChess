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
import { createBoard, generateUniqueID,
         Pieces, Move } from '../js/constants.js'
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

const Moves = ({ gameState, 
                 changeGameState, 
                 focusedPiece,
                 focusedPiecePosition,
                 changeFocusedPiece, 
                 currentTurn, 
                 changeCurrentTurn,
                 boardSpacing }) => {

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
                          piece={focusedPiece}
                          piecePosition={focusedPiecePosition}
                          newPosition={[i, w]}
                          gameState={gameState}
                          changeGameState={changeGameState}
                          changeFocusedPiece={changeFocusedPiece}
                          changeCurrentTurn={changeCurrentTurn}
                          moveImage={emptyMove}
                          moveAlt={"Empty Move"}
                          boardSpacing={boardSpacing}
                       />)
          } else {
            // Make sure the piece at the specified position isn't of the same owner (can't capture your own pieces)
            if (gameState[i][w][1] !== currentTurn) {
              moves.push(<Move 
                            piece={focusedPiece}
                            piecePosition={focusedPiecePosition}
                            newPosition={[i, w]}
                            gameState={gameState}
                            changeGameState={changeGameState}
                            changeFocusedPiece={changeFocusedPiece}
                            changeCurrentTurn={changeCurrentTurn}
                            moveImage={pieceMove}
                            moveAlt={"Piece Move"}
                            boardSpacing={boardSpacing}
                         />)
            }
          }
        }
      }
    }
  }

  return <div> {moves} </div>
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
          <Pieces 
            focusedPiece={focusedPiece}
            changeFocusedPiece={changeFocusedPiece}
            changeFocusedPiecePosition={changeFocusedPiecePosition}
            gameState={gameState} 
            boardSpacing={'--small-board-spacing'}
          />
          <Moves 
            gameState={gameState}
            changeGameState={changeGameState}
            focusedPiece={focusedPiece}
            focusedPiecePosition={focusedPiecePosition}
            changeFocusedPiece={changeFocusedPiece}
            currentTurn={currentTurn}
            changeCurrentTurn={changeCurrentTurn}
            boardSpacing={'--small-board-spacing'}
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
