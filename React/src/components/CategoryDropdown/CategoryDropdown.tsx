import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import "./CategoryDropdown.css";

interface CategoryDropdownProps {
  items: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  items,
  selectedCategories,
  setSelectedCategories,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = (item: string) => {
    if (selectedCategories.includes(item)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== item));
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, item]);
      }
    }
  };

  const removeItem = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategories(selectedCategories.filter((i) => i !== item));
  };

  return (
    <Dropdown
      show={isOpen}
      onToggle={(show) => setIsOpen(show)}
      autoClose="outside"
    >
      <Dropdown.Toggle
        variant="light"
        className="category-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="dropdown-content-display">
          {selectedCategories.length === 0 ? (
            <span className="placeholder-text">Select categories...</span>
          ) : (
            <div className="selected-tags">
              {selectedCategories.map((category) => (
                <span key={category} className="category-tag">
                  {category}
                  <button
                    className="remove-tag"
                    onClick={(e) => removeItem(category, e)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {items.map((item) => {
          const isDisabled =
            !selectedCategories.includes(item) &&
            selectedCategories.length >= 3;

          return (
            <Dropdown.Item
              key={item}
              as="div"
              onClick={() => toggleItem(item)}
              className={
                isDisabled ? "dropdown-item-disabled" : "dropdown-item-enabled"
              }
            >
              <Form.Check
                type="checkbox"
                id={`check-${item}`}
                label={item}
                checked={selectedCategories.includes(item)}
                disabled={isDisabled}
                onChange={() => {}}
              />
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CategoryDropdown;
