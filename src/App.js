import { Component } from "react";
import Game from "./Components/Game";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import Login from './Components/login'
import Signup from './Components/signup'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Zoom} from 'react-toastify';
export const  socket = io("http://localhost:5000");
 class App extends Component {
  render() {
    return <>
     <ToastContainer hideProgressBar={true} autoClose={1000} transition={Zoom}  position={"top-center"}/>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
    </>;
  }
}
export default App;
