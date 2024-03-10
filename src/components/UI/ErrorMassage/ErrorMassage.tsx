import React, { useEffect } from "react";
import "./styles.scss";
import icons from "../../../assets/icons/icons";

type ErrorMessageProps = {
  type: boolean | "error" | "success" | undefined | "warn" | "warning" | string;
  message: string | undefined;
  onClick: () => void;
  onClose: () => void;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  type,
  message,
  onClick,
  onClose,
}) => {
  const error = type === false || type === "error";
  const success = type === true || type === "success";
  const warning = type === undefined || type === "warn" || type === "warning";
  let className = "error-message";
  if (success) {
    className += " success";
  } else if (error) {
    className += " error";
  } else if (warning) {
    className += " warning";
  }

  useEffect(() => {
    const hideMessage = () => {
      onClose();
    };

    const timeout = setTimeout(hideMessage, 1700); // Скрыть сообщение через 5 секунд

    return () => {
      clearTimeout(timeout); // Очистить таймаут при размонтировании компонента
    };
  }, [onClose]);

  return (
    <div className={`${className} animated-error`}>
      {/* <div className="errHeader">
        <img
          src={success ? icons.xClosed : icons.xClosed}
          onClick={onClose}
          style={{ cursor: "pointer" }}
          alt="Close"
        />
      </div> */}
      <p className="errMessage">
        <span>
          {success
            ? message
              ? message
              : "Всё отлично"
            : error
            ? "Произошла ошибка: "
            : "Предупреждение: "}
        </span>
        {!success && message}
      </p>
      {error ? (
        <p onClick={onClick} className="errButton">
          Повторить
        </p>
      ) : (
        <p onClick={onClose} className="errButton">
          Закрыть
        </p>
      )}
    </div>
  );
};

export default ErrorMessage;
