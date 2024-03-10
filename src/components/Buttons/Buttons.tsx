import React, { useState } from "react";
import "./styles.scss";

type ButtonsProps = {
  text: string;
  onClick: () => void;
  ico?: string;
  className?: string;
  circle?: string;
  toolTip?: string; // Обновленное свойство для текста подсказки
};

const Buttons: React.FC<ButtonsProps> = ({
  text,
  onClick,
  ico,
  className,
  circle,
  toolTip,
}) => {
  const [isToolTipVisible, setToolTipVisible] = useState(false);

  const showToolTip = () => {
    setToolTipVisible(true);
  };

  const hideToolTip = () => {
    setToolTipVisible(false);
  };

  return (
    <button
      className={`button__container ${ico ? "iconContainer" : ""} ${className}`}
      onClick={onClick}
      onMouseEnter={showToolTip}
      onMouseLeave={hideToolTip}
    >
      {circle && <div className="circleNumber">{circle}</div>}
      {ico && <object type="image/svg+xml" data={ico}></object>}
      {text}
      {toolTip && isToolTipVisible && <div className="tooltip">{toolTip}</div>}
    </button>
  );
};

export default Buttons;
