import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

interface CategoryDropdownProps {
  items: string[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <>
      <Dropdown autoClose={false}>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedItems.length === 0
            ? "Please select categories"
            : `${selectedItems.length} selected`}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item) => (
            <Dropdown.Item
              key={item}
              as="div"
              onClick={() => toggleItem(item)}
            >
              <Form.Check
                type="checkbox"
                id={`check-${item}`}
                label={item}
                checked={selectedItems.includes(item)}
                onChange={() => {}}
              />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedItems.length > 0 && (
        <div style={{marginTop: '10px', color: 'black'}}>
          Selected: {selectedItems.join(', ')}
        </div>
      )}
    </>
  );
};

export default CategoryDropdown;