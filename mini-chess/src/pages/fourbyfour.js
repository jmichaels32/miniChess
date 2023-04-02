// Constants import
import { generateUniqueID } from '../js/constants.js'
import { mediumBoardFunctional,  
         whiteKing, whiteKnight, whiteRook, whitePawn,  
         blackKing, blackKnight, blackRook, blackPawn } from '../js/imports.js';
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

  // Black Pieces
  board[0][1] = [blackKing, Const.BLACK, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[0][2] = [blackKnight, Const.BLACK, Const.KNIGHT, !Const.CRITICAL, generateUniqueID()];
  board[0][3] = [blackRook, Const.BLACK, Const.ROOK, !Const.CRITICAL, generateUniqueID()];
  board[1][0] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[1][3] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];

  // White Pieces
  board[3][1] = [whiteKing, Const.WHITE, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[3][2] = [whiteKnight, Const.WHITE, Const.KNIGHT, !Const.CRITICAL, generateUniqueID()];
  board[3][3] = [whiteRook, Const.WHITE, Const.ROOK, !Const.CRITICAL, generateUniqueID()];
  board[2][0] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[2][3] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
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
