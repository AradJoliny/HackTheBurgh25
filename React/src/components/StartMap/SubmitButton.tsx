import React from 'react';

type SubmitButtonProps = {
    onClick: () => void;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
return(

    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick} // <-- make sure this is here!
    >
      Submit
    </button>
  );
}
export default SubmitButton;