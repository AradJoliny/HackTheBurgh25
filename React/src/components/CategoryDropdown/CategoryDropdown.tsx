import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import './CategoryDropdown.css';

interface CategoryDropdownProps {
  items: string[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // convert to json
  const selectedItemsJSON = JSON.stringify({
    categories: selectedItems
  });

  const toggleItem = (item: string) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        if (prev.length < 3) {
          return [...prev, item];
        }
        return prev;
      }
    });
  };

  return (
    <>
      <Dropdown autoClose={false}>
        <Dropdown.Toggle
          variant="primary"
          id="dropdown-basic"
          className="category-dropdown-toggle"
        >
          {selectedItems.length === 0
            ? "Please select categories (max 3)"
            : `${selectedItems.length}/3 selected`}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item) => {
            const isDisabled = !selectedItems.includes(item) && selectedItems.length >= 3;

            return (
              <Dropdown.Item
                key={item}
                as="div"
                onClick={() => toggleItem(item)}
                className={isDisabled ? 'dropdown-item-disabled' : 'dropdown-item-enabled'}
              >
                <Form.Check
                  type="checkbox"
                  id={`check-${item}`}
                  label={item}
                  checked={selectedItems.includes(item)}
                  disabled={isDisabled}
                  onChange={() => {}}
                />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>

      {selectedItems.length > 0 && (
        <div className="selected-items-display">
          Selected: {selectedItems.join(', ')}
        </div>
      )}
    </>
  );
};

export default CategoryDropdown;