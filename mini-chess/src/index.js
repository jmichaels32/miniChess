// Import section
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import CSS files
import './index.css';

// Import the various pages
import Home from "./pages/home.js";
import ThreeByThree from "./pages/threebythree.js";
import FourByFour from "./pages/fourbyfour.js";
import FiveByFive from "./pages/fivebyfive.js";
import NoPage from "./pages/nopage.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/threebythree" element={<ThreeByThree />} />
        <Route path="/fourbyfour" element={<FourByFour />} />
        <Route path="/fivebyfive" element={<FiveByFive />} />
        <Route path="/*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
