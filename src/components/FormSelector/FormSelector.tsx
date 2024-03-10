import React, { useState, useRef, useEffect } from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";

type Option = {
  id: string;
  value: string;
  display_name: string;
};

type FormSelectorProps = {
  options: Option[];
  onChange: (value: string) => void;
  error: boolean;
  ico: string | undefined;
  style: string;
  value: string;
  disabled: boolean;
};

const FormSelector: React.FC<FormSelectorProps> = ({
  options,
  onChange,
  error,
  ico,
  style,
  value,
  disabled,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    value === null ? "" : value
  );
  const [isOpen, setIsOpen] = useState(false);

  const [activeOption, setActiveOption] = useState("");

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const formSelectorRef = useRef<HTMLDivElement | null>(null);

  const handleOptionChange = (option: Option) => {
    setSelectedOptions([option.value]);
    setSelectedOption(option.display_name);
    onChange(option.value);
    setIsOpen(!isOpen);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!filteredOptions.length) {
      setFilteredOptions(options);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setIsOpen(true);
    setSelectedOption(inputValue);
    setFilteredOptions(
      options.filter((option) =>
        option.display_name.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
    setActiveOption(inputValue);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      formSelectorRef.current &&
      !formSelectorRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const foundOption = options.find((item) => item.value === selectedOption);
    if (foundOption) {
      setSelectedOption(foundOption.display_name);
    }
  }, [selectedOption, options]);

  return (
    <div className={`FormSelector ${style}`} ref={formSelectorRef}>
      <div className="formContainerSelector">
        <input
          className={`formSelector ${error ? "error" : ""} ${
            ico ? "paddingIco" : ""
          }`}
          value={selectedOption}
          onClick={handleInputClick}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <img
          src={icons.chevronDown}
          className={`downImg ${isOpen ? "upImg" : ""}`}
          alt="Chevron"
          onClick={handleInputClick}
        />
      </div>
      {isOpen && (
        <div className={"optionsContainer"}>
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`optionsItem ${
                selectedOptions.includes(option.value) ? "focus" : ""
              }`}
              onClick={() => handleOptionChange(option)}
            >
              <p>{option.display_name}</p>
              {selectedOptions.includes(option.value) && (
                <img src={icons.check} alt="Icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormSelector;
