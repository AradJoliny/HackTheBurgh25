import { useState } from "react";
import Title from "./components/Title";
import './App.css';
import Map from "./components/Map";
import SubmitButton from "./components/SubmitButton";
import Slider from "./components/Slider";

function App(){

   const [radius, setRadius] = useState<number>(50); // shared radius state

  return (
      <>
    <div className="app">
      <div><Title /></div>
      {/* Pass radius state to Map */}
      <Map radius={radius} />
      {/* Pass radius state and setter to Slider */}
      <Slider radius={radius} setRadius={setRadius} />
    </div>
          <div><SubmitButton /></div>
        </>
  );
}

export default App;