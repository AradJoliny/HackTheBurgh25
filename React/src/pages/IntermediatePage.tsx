import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const IntermediatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="content">
        <h1>Intermediate Page</h1>
        <p>This is the middle step</p>
        <button
          onClick={() => navigate("/final")}
          style={{ padding: "10px 20px", margin: "10px" }}
        >
          Go to Final Page
        </button>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "10px 20px", margin: "10px" }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default IntermediatePage;
