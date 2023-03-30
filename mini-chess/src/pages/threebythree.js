// Import section
import React, { useState } from 'react';

// CSS import
import '../styles/board.css';
import '../styles/global.css'

// Constants import
import { title, smallBoardFunctional,  
         whiteKing, whitePawn,
         blackKing, blackPawn } from '../js/imports.js';
import { createBoard, 
         generateUniqueID, 
         Board} from '../js/constants.js'
import * as Const from '../js/constants.js'

// TODO: ADD RIGHT CLICK DESELECT BUTTON

function initializeThreeByThree(board) {
  // Store as tuple to know:
  //  The SVG representing the piece
  //  Which player owns the piece
  //  The move type for the piece
  //  If the piece is critical or not
  //  The unique ID representing the piece
  board[0][1] = [blackPawn, Const.BLACK, Const.KING, !Const.CRITICAL, generateUniqueID()];
  board[0][2] = [blackKing, Const.BLACK, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[2][0] = [whiteKing, Const.WHITE, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[2][1] = [whitePawn, Const.WHITE, Const.KING, !Const.CRITICAL, generateUniqueID()];
  return board;
}

const ThreeByThree = () => {
  const emptyBoard = createBoard(3);
  const initializedBoard = initializeThreeByThree(emptyBoard)
  
  const [gameState, changeGameState] = useState(initializedBoard)
  const [focusedPiece, changeFocusedPiece] = useState(Const.ZEROPIECE)
  const [currentTurn, changeCurrentTurn] = useState(Const.WHITE)
  const [hasWon, changeWonState] = useState([false, Const.WHITE])

  const deselectPiece = () => {
    changeFocusedPiece(Const.ZEROPIECE)
  }

  const resetBoard = () => {
    changeGameState(emptyBoard)
    changeCurrentTurn(Const.WHITE)
    changeWonState((false, Const.WHITE))
  }

  return (
    <div className="board-spacing">
      <div className="text" id="left-button" onClick={deselectPiece}>
        <button onClick={resetBoard}> New game </button>
      </div>
      <div className="game-area">
        <img className="title-secondary" src={title} alt={"miniChess"}/>
        <div className="board-container">
          <img src={smallBoardFunctional} alt={"3x3 Board"}/>
          <Board 
            gameState={gameState}
            changeGameState={changeGameState}
            focusedPiece={focusedPiece}
            changeFocusedPiece={changeFocusedPiece}
            currentTurn={currentTurn}
            changeCurrentTurn={changeCurrentTurn}
            changeWonState={changeWonState}
            boardSpacing={'--small-board-spacing'}
          />
        </div>
      </div>
      <div className="text" id="right-button" onClick={deselectPiece}>
        <button onClick={resetBoard}> End game </button>
      </div>
      {hasWon[0] && <p className="display-win text"> {hasWon[1] ? 'White wins' : 'Black wins'} </p>}
    </div>
  )
}

export default ThreeByThree;
