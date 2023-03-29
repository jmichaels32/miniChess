// Import section
import { Outlet, Link } from "react-router-dom";

// CSS import section
import '../styles/Home.css';
import '../styles/global.css'

// SVG import section
import { title, smallBoard, mediumBoard, largeBoard } from '../js/imports';

// Define a template for board links
const Board = ({link, board, alt, text}) => {
  return (
    <div className="center-text">
      <Link to={link}>
        <img className="board-hover" src={board} alt={alt}/>
      </Link> 
      <p className="text dimensions"> {text} </p>
    </div>
  )
}

function Home() {
  return (
    <div className="app">
      <img id="title" src={title} alt="miniChess"/>
      <p className="text" id="description"> Select a size </p>
      <div className="boards">
        <div className="board" id="smallboard">
          <Board link={"/threebythree"} board={smallBoard} alt={"Small Board"} text={"3 x 3"}/>
        </div>
        <div className="board">
          <Board link={"/fourbyfour"} board={mediumBoard} alt={"Medium Board"} text={"4 x 4"}/>
        </div>
        <div className="board" id="largeboard">
          <Board link={"/fivebyfive"} board={largeBoard} alt={"Large Board"} text={"5 x 5"}/>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Home;
