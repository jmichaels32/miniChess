// Import section
import React, { useState } from 'react';

// CSS import
import '../styles/board.css';
import '../styles/global.css'

// Constants import
import { title } from './imports.js';
import { createBoard, 
         generateUniqueID, 
         Board} from './constants.js'
import * as Const from './constants.js'

// TODO: Look into google ad services 
// TODO: Add right click deselect button
// TODO: Make the buttons mean more (both are the same right now)
// TODO: Make a profile login page (backend)
// TODO: Make a chess board customizer (can select your own board size, piece dynamics, and setup)
//   -> Requires a complete revamping of how the board is created
//   -> link it with your profile
// TODO: Make it multiplayer
//   -> Requires clock
//   -> Premoves?
//   -> ELO ranking?
// TODO: Improve logo design???

const ChessPage = ({ boardSize, initializationFunction, boardSpacing, boardImg, boardAlt }) => {
  const emptyBoard = createBoard(boardSize);
  const initializedBoard = initializationFunction(emptyBoard)
  
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
    changeWonState([false, Const.WHITE])
  }

  return (
    <div className="board-spacing">
      <div className="text" id="left-button" onClick={deselectPiece}>
        <button onClick={resetBoard}> New game </button>
      </div>
      <div className="game-area">
        <img className="title-secondary" src={title} alt={"miniChess"}/>
        <div className="board-container">
          <img src={boardImg} alt={boardAlt}/>
          <Board 
            gameState={gameState}
            changeGameState={changeGameState}
            focusedPiece={focusedPiece}
            changeFocusedPiece={changeFocusedPiece}
            currentTurn={currentTurn}
            changeCurrentTurn={changeCurrentTurn}
            changeWonState={changeWonState}
            boardSpacing={boardSpacing}
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

export default ChessPage