import React from "react";
import ReactSelect from "react-select";

interface SelectProps {
  disabled: boolean;
  label: string;
  onChange: (value: Record<string, any>) => void;
  value: Record<string, any>;
  options: Record<string, any>[];
}

const Select: React.FC<SelectProps> = ({
  disabled,
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2 text-sm">
        <ReactSelect
          isDisabled={disabled}
          options={options}
          isMulti
          onChange={onChange}
          value={value}
          required
        />
      </div>
    </div>
  );
};

export default Select;
