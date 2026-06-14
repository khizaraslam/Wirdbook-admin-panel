import React from "react";
import {
  CONTENT_TYPE_OPTIONS,
  type ContentType,
} from "@/utils/helpers/enums/content-type.enum";

interface LanguageTypeSwitcherProps {
  value: ContentType;
  onChange: (type: ContentType) => void;
}

const LanguageTypeSwitcher: React.FC<LanguageTypeSwitcherProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
      {CONTENT_TYPE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            value === option.value
              ? "bg-primary text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageTypeSwitcher;
