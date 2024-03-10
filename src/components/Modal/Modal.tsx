import React, { FC, Fragment, useEffect } from "react";
import "./styles.scss";

interface ModalProps {
  content: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
  styleModal: string;
}

const Modal: FC<ModalProps> = ({ isVisible, content, onClose, styleModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Fragment>
      <div
        className={`modalContainerBg ${isVisible && "active"}`}
        onClick={onClose}
      ></div>
      <div className={`modal ${isVisible && "active"} ${styleModal}`}>
        {content}
      </div>
    </Fragment>
  );
};

export default Modal;
