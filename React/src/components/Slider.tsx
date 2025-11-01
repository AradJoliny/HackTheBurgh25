import { useState } from 'react';

export default function Slider() {
  const [value, setValue] = useState(50); // initial value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div className="mb-3">
      <label htmlFor="range4" className="form-label">
        Radius
      </label>
      <input
        type="range"
        className="form-range"
        min="0"
        max="100"
        id="range4"
        value={value}
        onChange={handleChange}
      />
      <output htmlFor="range4" id="rangeValue" aria-hidden="true">
        {value}
      </output>
    </div>
  );
}