import React from 'react';

type SubmitButtonProps = {
    onClick: () => void;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
return(

    <div className="d-grid gap-2 col-6 mx-auto">
        <button className="btn btn-light" type="button" onClick={onClick}>Submit</button>
    </div>
  );
}
export default SubmitButton;