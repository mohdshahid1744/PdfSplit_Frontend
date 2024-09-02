import logo from './logo.svg';
import './App.css';
import Home from './Component/Home';
import Split from './Component/Split';
import Download from './Component/Download';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/split/:id' element={<Split/>} />
        <Route path='/download' element={<Download/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
