import React from "react";
import { useNavigate } from "react-router-dom";

const FinalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      <h1>Final Page</h1>
      <p>You've completed the flow!</p>
      <button onClick={() => navigate("/")}>Start Over</button>
    </div>
  );
};

export default FinalPage;
