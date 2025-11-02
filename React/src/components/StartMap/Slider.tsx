type SliderProps = {
  radius: number;
  setRadius: (r: number) => void;
};

export default function Slider({ radius, setRadius }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setRadius(Number(e.target.value));

  return (
    <div className="mb-3">
      <label htmlFor="radiusSlider" className="form-label">
        Circle Radius: {(radius).toFixed(2)} km
      </label>
      <input
        type="range"
        className="form-range"
        min={1}
        max={10}
        step={1}
        value={radius}
        id="radiusSlider"
        onChange={handleChange}
      />
    </div>
  );
}