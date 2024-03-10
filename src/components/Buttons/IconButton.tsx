import React from "react";
import "./styles.scss";

type IconButtonProps = {
  text?: string;
  onClick: () => void;
  style?: string;
  icon: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  text = "",
  onClick,
  style,
  icon,
}) => {
  return (
    <span className={style ? style : "icon-button"} onClick={onClick}>
      {text}
      <img src={icon} alt="" />
    </span>
  );
};

export default IconButton;
