import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import './CategoryDropdown.css';

interface CategoryDropdownProps {
  items: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ items, selectedCategories, setSelectedCategories }) => {
  const toggleItem = (item: string) => {
    if (selectedCategories.includes(item)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== item));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, item]);
    }
  };


  return (
    <>
      <Dropdown autoClose={false}>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedCategories.length === 0
            ? "Please select categories (max 3)"
            : `${selectedCategories.length}/3 selected`}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item) => {
            const isDisabled =
              !selectedCategories.includes(item) && selectedCategories.length >= 3;

            return (
              <Dropdown.Item
                key={item}
                disabled={isDisabled}
              >
                <Form.Check
                  type="checkbox"
                  label={item}
                  checked={selectedCategories.includes(item)}
                  disabled={isDisabled}
                  onChange={() => {
                    if (selectedCategories.includes(item)) {
                      setSelectedCategories(
                        selectedCategories.filter((i) => i !== item)
                      );
                    } else {
                      setSelectedCategories([...selectedCategories, item]);
                    }
                  }}
                />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>

      {selectedCategories.length > 0 && (
        <div className="selected-items-display">
          Selected: {selectedCategories.join(", ")}
        </div>
      )}
    </>
  );
};
export default CategoryDropdown;