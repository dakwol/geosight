import React, { FC, useEffect } from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";

interface ModalProps {
  content: React.ReactNode;
  isOpen: boolean;
  classModal?: string;
  classBgModal?: string;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({
  content,
  onClose,
  isOpen,
  classModal,
  classBgModal,
}) => {
  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <>
      <div
        className={`modalContainerBg ${
          isOpen && `active ${classBgModal && classBgModal}`
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`modal ${isOpen && "active"} ${classModal && classModal}`}
      >
        <img
          className="xCloseButton"
          src={icons.xClosed}
          onClick={onClose}
        ></img>
        {content}
      </div>
    </>
  );
};

export default Modal;
