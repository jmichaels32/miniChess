// Constants import
import { generateUniqueID } from '../js/constants.js'
import { mediumBoardFunctional,  
         whiteKing, whitePawn, whiteKnight, whiteBishop, 
         blackKing, blackPawn, blackRook, blackQueen } from '../js/imports.js';
import ChessPage from '../js/chessPage.js'
import * as Const from '../js/constants.js'

// TODO: Sometimes glitchy SVG loading

function initializeFourbyFour(board) {
  // Store as tuple to know:
  //  The SVG representing the piece
  //  Which player owns the piece
  //  The move type for the piece
  //  If the piece is critical or not
  //  The unique ID representing the piece
  board[0][1] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[0][2] = [blackKing, Const.BLACK, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[3][0] = [whiteKing, Const.WHITE, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[3][1] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[3][2] = [whiteKnight, Const.WHITE, Const.KNIGHT, !Const.CRITICAL, generateUniqueID()];
  board[3][3] = [whiteBishop, Const.WHITE, Const.BISHOP, !Const.CRITICAL, generateUniqueID()];

  board[0][3] = [blackQueen, Const.BLACK, Const.QUEEN, !Const.CRITICAL, generateUniqueID()];
  board[0][0] = [blackRook, Const.BLACK, Const.ROOK, !Const.CRITICAL, generateUniqueID()];
  return board;
}

const FourbyFour = () => {
  return <ChessPage 
           boardSize={4}
           initializationFunction={initializeFourbyFour}
           boardSpacing={'--medium-board-spacing'}
           boardImg={mediumBoardFunctional}
           boardAlt={"Medium Board"}
         />
}

export default FourbyFour;
