import React from "react";
import {
  findOptionByKey,
  type LocalizedOption,
} from "@/utils/helpers/qasidas/field-options";

interface LocalizedSelectProps {
  label: string;
  options: LocalizedOption[];
  en: string;
  ar: string;
  onChange: (opt: LocalizedOption | null) => void;
  placeholder?: string;
}

const LocalizedSelect: React.FC<LocalizedSelectProps> = ({
  label,
  options,
  en,
  ar,
  onChange,
  placeholder = "Select…",
}) => {
  const matched = findOptionByKey(options, en, ar);
  const currentKey = matched
    ? `${matched.en}\0${matched.ar}`
    : en || ar
      ? `__custom__\0${en}\0${ar}`
      : "";

  const extras: LocalizedOption[] =
    !matched && (en || ar) ? [{ en: en || "", ar: ar || "" }] : [];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="form-label">{label}</label>
      <select
        className="form-input cursor-pointer"
        value={currentKey}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) {
            onChange(null);
            return;
          }
          if (v.startsWith("__custom__\0")) {
            return;
          }
          const [nextEn, nextAr] = v.split("\0");
          const found = options.find((o) => o.en === nextEn && o.ar === nextAr);
          onChange(found ?? { en: nextEn, ar: nextAr });
        }}
      >
        <option value="">{placeholder}</option>
        {extras.map((o) => (
          <option key={`__custom__\0${o.en}\0${o.ar}`} value={`__custom__\0${o.en}\0${o.ar}`}>
            {o.en}
            {o.ar ? ` — ${o.ar}` : ""} (current)
          </option>
        ))}
        {options.map((o) => (
          <option key={`${o.en}\0${o.ar}`} value={`${o.en}\0${o.ar}`}>
            {o.en}
            {o.ar ? ` — ${o.ar}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocalizedSelect;
