import React from "react";
import "./styles.scss";

type DeleteButtonsProps = {
  text: string;
  onClick: () => void;
};

const DeleteButtons: React.FC<DeleteButtonsProps> = ({ text, onClick }) => {
  return (
    <button className="deleteButton__container" onClick={onClick}>
      {text}
    </button>
  );
};

export default DeleteButtons;
