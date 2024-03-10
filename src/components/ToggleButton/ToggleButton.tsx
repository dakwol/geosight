import React, { ChangeEvent } from "react";
import "./styles.scss";

type ToggleButtonProps = {
  onToggle: (formDataKey: string, isChecked: boolean) => void;
  text: string | undefined;
  formDataKey: string;
  styleSwitch?: string;
  classesText?: string;
  styleRound?: string;
  checked: boolean | undefined;
  styleContainer?: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onToggle,
  text,
  formDataKey,
  styleSwitch,
  classesText,
  styleRound,
  checked,
  styleContainer,
}) => {
  const onChangeValue = (isChecked: boolean) => {
    onToggle(formDataKey, isChecked);
  };

  return (
    <div className={`flex ${styleContainer}`}>
      <label className="switch">
        <input
          type="checkbox"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChangeValue(e.target.checked)
          }
          checked={checked}
        />
        <span className={`slider round ${styleSwitch} ${styleRound}`}></span>
      </label>

      <p
        className={classesText ? "checkboxText " + classesText : "checkboxText"}
      >
        {text}
      </p>
    </div>
  );
};

export default ToggleButton;
