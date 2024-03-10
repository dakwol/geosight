import React from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";

type CheckboxProps = {
  id: string;
  label: string | undefined;
  checked: boolean | undefined;
  onChange: (id: string) => void;
  count?: number;
};

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  count,
}) => {
  return (
    <div className="checkbox-container">
      <div className={`checkFlex ${checked && id}`}>
        <div className="checkbox">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={() => onChange(id)}
            className={`checkbox-input ${id}`}
          />
          <object
            type="image/svg+xml"
            data={icons.Checkmark}
            className="checkboxMark"
          ></object>
        </div>
        <label
          htmlFor={id}
          className={`checkbox-label ${checked ? "checked" : ""}`}
        >
          {label}
        </label>
        <p className={`checkboxCount ${checked ? "checked" : ""}`}>{count}</p>
      </div>
    </div>
  );
};

export default Checkbox;
