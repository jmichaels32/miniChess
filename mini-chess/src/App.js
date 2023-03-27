// CSS import section
import './App.css';
import './global.css'

// SVG import section
import { title, smallBoard, mediumBoard, largeBoard } from './imports';


// Navigating to a new page through react
// Make three divs take up the same amount of spacing (middle board perfectly centered)
// Change path depending on hovering or not
// Change link depending on clicked or not


function App() {
  return (
    <div className="app">
      <img id="title" src={title} alt="miniChess"/>
      <p className="text" id="description"> Select a size </p>
      <div className="boards">
        <div className="board" id="smallboard">
          <div className="center-text">
            <img className="board-hover" src={smallBoard} alt="Small Board"/>
            <p className="text dimensions"> 3 x 3 </p>
          </div>
        </div>
        <div className="board">
          <img className="board-hover" src={mediumBoard} alt="Medium Board"/>
          <p className="text dimensions"> 4 x 4 </p>
        </div>
        <div className="board" id="largeboard">
          <div className="center-text">
            <img className="board-hover" src={largeBoard} alt="Large Board"/>
            <p className="text dimensions"> 5 x 5 </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
