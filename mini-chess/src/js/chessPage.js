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

const ChessPage = ({ boardSize, initializationFunction, boardSpacing, boardImg, boardAlt }) => {
  const defaultCastlingRights = {
    true: { kingSide: true, queenSide: true },
    false: { kingSide: true, queenSide: true }
  }

  const [gameState, changeGameState] = useState(() => initializationFunction(createBoard(boardSize)))
  const [focusedPiece, changeFocusedPiece] = useState(Const.ZEROPIECE)
  const [currentTurn, changeCurrentTurn] = useState(Const.WHITE)
  const [hasWon, changeWonState] = useState([false, Const.WHITE])
  const [isCheck, changeCheckState] = useState(false)
  const [isDraw, changeDrawState] = useState(false)
  const [enPassantTarget, changeEnPassantTarget] = useState(null)
  const [castlingRights, changeCastlingRights] = useState(defaultCastlingRights)

  const deselectPiece = () => {
    changeFocusedPiece(Const.ZEROPIECE)
  }

  const newGame = () => {
    changeGameState(initializationFunction(createBoard(boardSize)))
    changeFocusedPiece(Const.ZEROPIECE)
    changeCurrentTurn(Const.WHITE)
    changeWonState([false, Const.WHITE])
    changeCheckState(false)
    changeDrawState(false)
    changeEnPassantTarget(null)
    changeCastlingRights({
      true: { kingSide: true, queenSide: true },
      false: { kingSide: true, queenSide: true }
    })
  }

  const endGame = () => {
    window.location.href = "/"
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    deselectPiece()
  }

  return (
    <div className="board-spacing">
      <div className="text" id="left-button">
        <button onClick={newGame}> New game </button>
      </div>
      <div className="game-area">
        <img className="title-secondary" src={title} alt={"miniChess"}/>
        <div className="board-container" onContextMenu={handleContextMenu}>
          <img src={boardImg} alt={boardAlt}/>
          <Board
            gameState={gameState}
            changeGameState={changeGameState}
            focusedPiece={focusedPiece}
            changeFocusedPiece={changeFocusedPiece}
            currentTurn={currentTurn}
            changeCurrentTurn={changeCurrentTurn}
            changeWonState={changeWonState}
            isCheck={isCheck}
            changeCheckState={changeCheckState}
            changeDrawState={changeDrawState}
            enPassantTarget={enPassantTarget}
            changeEnPassantTarget={changeEnPassantTarget}
            castlingRights={castlingRights}
            changeCastlingRights={changeCastlingRights}
            boardSpacing={boardSpacing}
          />
        </div>
      </div>
      <div className="text" id="right-button">
        <button onClick={endGame}> End game </button>
      </div>
      {hasWon[0] && <p className="display-win text"> {hasWon[1] ? 'White wins' : 'Black wins'} </p>}
      {isDraw && <p className="display-win text"> Stalemate - Draw </p>}
    </div>
  )
}

export default ChessPage
