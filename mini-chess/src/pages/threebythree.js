// Constants import
import { generateUniqueID } from '../js/constants.js'
import { smallBoardFunctional,  
         whiteKing, whitePawn,
         blackKing, blackPawn } from '../js/imports.js';
import ChessPage from '../js/chessPage.js'
import * as Const from '../js/constants.js'

function initializeThreebyThree(board) {
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
  return <ChessPage 
           boardSize={3}
           initializationFunction={initializeThreebyThree}
           boardSpacing={'--small-board-spacing'}
           boardImg={smallBoardFunctional}
           boardAlt={"Small Board"}
         />
}

export default ThreeByThree;