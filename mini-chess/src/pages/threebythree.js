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

const Moves = ({ focusedPiece }) => {
  // Find the current piece's position
  

  return (
    <div>

    </div>
  )
}

const ChessPiece = ({ focusedPiece, 
                      changeFocusedPiece, 
                      currentTurn, 
                      piece, 
                      position }) => {
  const pieceImage = piece[0]
  const [topPosition, leftPosition] = position
  
  const style = {
    top: topPosition,
    left: leftPosition,
    backgroundColor: focusedPiece == piece
      ? getComputedStyle(document.body).getPropertyValue('--selected-piece-background')
      : 'transparent',
  }

  return (
    <button onClick={() => {changeFocusedPiece(piece)}} className="piece" style={style}>
      <img className="piece-img" src={pieceImage} alt="Chess Piece"/>
    </button>
    )
}


// Conditionally adds the correct pieces to the board
const CompiledPieces = ({ focusedPiece, changeFocusedPiece, currentTurn, gameState }) => {
  const pieces = []
  for (var i = 0; i < gameState.length; i++) {
    for (var w = 0; w < gameState.length; w++) {
      if (gameState[i][w] !== Const.ZEROPIECE) {
        pieces.push(<ChessPiece 
                      focusedPiece={focusedPiece}
                      changeFocusedPiece={changeFocusedPiece}
                      currentTurn={currentTurn}
                      piece={gameState[i][w]} 
                      position={[`calc(var(--small-board-spacing) * ${i})`, 
                                 `calc(var(--small-board-spacing) * ${w})`]}
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
  const [focusedPiece, changeFocusedPiece] = useState(0)
  const [currentTurn, changeCurrentTurn] = useState(Const.WHITETURN)

  const deselectPiece = () => {
    changeFocusedPiece(0)
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
            currentTurn={currentTurn}
            gameState={gameState} 
          />
          <Moves focusedPiece={focusedPiece}/>
        </div>
      </div>
      <div className="text" id="right-button" onClick={deselectPiece}>
        <button> End game </button>
      </div>
    </div>
  )
}

export default ThreeByThree;
