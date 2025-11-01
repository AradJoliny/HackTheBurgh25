import Title from "./components/Title";
import './App.css';
import Map from "./components/Map";
import SubmitButton from "./components/SubmitButton";
import Slider from "./components/Slider";

function App(){

    return (
        <div className="app">
            <div><Title /></div>
            <Map />
            <Slider />
            <SubmitButton />
        </div>
    );
}

export default App;