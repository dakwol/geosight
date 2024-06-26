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
  onChange: (value: string | string[]) => void;
  onScroll?: () => void;
  onSearch?: (value: string) => void;
  error: boolean;
  ico: string | undefined;
  style: string;
  value: string;
  disabled: boolean;
  friendlyInput: boolean | undefined;
  multiple?: boolean | undefined;
  placeholder: string | undefined;
};

const FormSelector: React.FC<FormSelectorProps> = ({
  options,
  onChange,
  onScroll,
  onSearch,
  error,
  ico,
  style,
  value,
  disabled,
  friendlyInput,
  placeholder,
  multiple,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    setSelectedOption(value === undefined ? "" : value);
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);

  const [activeOption, setActiveOption] = useState("");

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const formSelectorRef = useRef<HTMLDivElement | null>(null);

  const formSelectorOptionRef = useRef<HTMLDivElement | null>(null);
  const debounceSearch = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (
      formSelectorOptionRef.current &&
      formSelectorOptionRef.current.scrollHeight -
        formSelectorOptionRef.current.scrollTop ===
        formSelectorOptionRef.current.clientHeight
    ) {
      onScroll && onScroll();
      setFilteredOptions(options);
    }
  };

  const handleOptionChange = (option: Option) => {
    if (multiple) {
      // Проверяем, была ли уже выбрана эта опция
      const isSelected = selectedOptions.includes(option.value);

      if (isSelected) {
        // Если опция уже выбрана, удаляем её из выбранных
        setSelectedOptions((prev) =>
          prev.filter((item) => item !== option.value)
        );
        onChange(selectedOptions.filter((item) => item !== option.value));
      } else {
        // Если опция не была выбрана ранее, добавляем её в выбранные
        setSelectedOptions((prev) => [...prev, option.value]);
        onChange([...selectedOptions, option.value]);
      }
    } else {
      setSelectedOptions([option.value]);
      setSelectedOption(option.display_name);
      onChange(option.value);
      setIsOpen(false);
    }
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
    setSelectedOption(inputValue); // Обновляем введенное значение в поле

    if (debounceSearch.current) {
      clearTimeout(debounceSearch.current);
    }

    debounceSearch.current = setTimeout(() => {
      if (onSearch) {
        onSearch(inputValue);
      }
    }, 500);

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

  console.log("====================================");
  console.log("options", options);
  console.log("====================================");

  useEffect(() => {
    const foundOption = options?.find((item) => item.value === selectedOption);
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
          } ${friendlyInput && "friendly"}`}
          value={
            multiple
              ? selectedOptions
                  .map(
                    (option) =>
                      options.find((opt) => opt.value === option)
                        ?.display_name || ""
                  )
                  .join(", ")
              : selectedOption
          }
          onClick={handleInputClick}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
        />
        <img
          src={icons.chevronDown}
          className={`downImg ${isOpen ? "upImg" : ""}`}
          alt="Chevron"
          onClick={handleInputClick}
        />
      </div>
      {isOpen && (
        <div
          className={"optionsContainer"}
          ref={formSelectorOptionRef}
          onScroll={onScroll && handleScroll}
        >
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
