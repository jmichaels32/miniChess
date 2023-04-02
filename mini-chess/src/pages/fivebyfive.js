// Constants import
import { generateUniqueID } from '../js/constants.js'
import { largeBoardFunctional,  
         whiteKing, whiteQueen, whiteRook, whiteBishop, whiteKnight, whitePawn,  
         blackKing, blackQueen, blackRook, blackBishop, blackKnight, blackPawn } from '../js/imports.js';
import ChessPage from '../js/chessPage.js'
import * as Const from '../js/constants.js'

// TODO: Sometimes glitchy SVG loading

function initializeFivebyFive(board) {
  // Store as tuple to know:
  //  The SVG representing the piece
  //  Which player owns the piece
  //  The move type for the piece
  //  If the piece is critical or not
  //  The unique ID representing the piece

  // Black Pieces
  board[0][0] = [blackKing, Const.BLACK, Const.KING, Const.CRITICAL, generateUniqueID()];
  board[0][1] = [blackQueen, Const.BLACK, Const.QUEEN, !Const.CRITICAL, generateUniqueID()];
  board[0][2] = [blackBishop, Const.BLACK, Const.BISHOP, !Const.CRITICAL, generateUniqueID()];
  board[0][3] = [blackKnight, Const.BLACK, Const.KNIGHT, !Const.CRITICAL, generateUniqueID()];
  board[0][4] = [blackRook, Const.BLACK, Const.ROOK, !Const.CRITICAL, generateUniqueID()];

  // Black pawn layer
  board[1][0] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[1][1] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[1][2] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[1][3] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[1][4] = [blackPawn, Const.BLACK, Const.PAWN, !Const.CRITICAL, generateUniqueID()];

  // White Pieces
  board[4][0] = [whiteRook, Const.WHITE, Const.ROOK, !Const.CRITICAL, generateUniqueID()];
  board[4][1] = [whiteKnight, Const.WHITE, Const.KNIGHT, !Const.CRITICAL, generateUniqueID()];
  board[4][2] = [whiteBishop, Const.WHITE, Const.BISHOP, !Const.CRITICAL, generateUniqueID()];
  board[4][3] = [whiteQueen, Const.WHITE, Const.QUEEN, !Const.CRITICAL, generateUniqueID()];
  board[4][4] = [whiteKing, Const.WHITE, Const.KING, Const.CRITICAL, generateUniqueID()];

  // White pawn layer
  board[3][0] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[3][1] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[3][2] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[3][3] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];
  board[3][4] = [whitePawn, Const.WHITE, Const.PAWN, !Const.CRITICAL, generateUniqueID()];

  return board;
}

const FivebyFive = () => {
  return <ChessPage 
           boardSize={5}
           initializationFunction={initializeFivebyFive}
           boardSpacing={'--large-board-spacing'}
           boardImg={largeBoardFunctional}
           boardAlt={"Medium Board"}
         />
}

export default FivebyFive;
