type SubmitButtonProps = {
  onSubmit: () => void;
};

export default function submitButton() {
  return (
    <div className="d-grid gap-2 col-6 mx-auto">
      <button className="btn btn-light" type="button">
        Submit
      </button>
    </div>
  );
}
