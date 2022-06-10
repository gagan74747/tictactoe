import { Component } from "react";
import Game from "./Components/Game";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends Component {
  render() {
    return <>
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
    </>;
  }
}
export default App;
