import React from "react";
import Title from "./components/Title";
import CategoryDropdown from "./components/CategoryDropdown/CategoryDropdown";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const items: string[] = [
    "Coffee",
    "Dinner",
    "Lunch",
    "Walk",
    "Movies",
    "Museum",
    "Outdoor",
    "Live Events",
    "Drinks",
    "Shopping"
  ];

  return (
    <div className="App">
      <div className="content">
        <CategoryDropdown items={items} />
        <Title />
      </div>
    </div>
  );
};

export default App;