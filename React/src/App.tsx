import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import IntermediatePage from "./pages/IntermediatePage";
import FinalPage from "./pages/FinalPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/intermediate" element={<IntermediatePage />} />
          <Route path="/final" element={<FinalPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
