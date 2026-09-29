import React, { useEffect, useId, useMemo, useRef, useState } from "react";

export interface SuggestPair {
  en: string | null;
  ar: string | null;
}

interface SuggestPairInputProps {
  label: string;
  lang: "en" | "ar";
  value: string;
  onChange: (value: string) => void;
  /** Called when user picks an existing pair — fill both languages. */
  onSelectPair: (pair: SuggestPair) => void;
  options: SuggestPair[];
  placeholder?: string;
  hint?: string;
  dir?: "ltr" | "rtl";
  className?: string;
}

const labelFor = (pair: SuggestPair, lang: "en" | "ar") => {
  const primary = lang === "en" ? pair.en : pair.ar;
  const secondary = lang === "en" ? pair.ar : pair.en;
  if (primary && secondary) return `${primary} — ${secondary}`;
  return primary || secondary || "";
};

const SuggestPairInput: React.FC<SuggestPairInputProps> = ({
  label,
  lang,
  value,
  onChange,
  onSelectPair,
  options,
  placeholder,
  hint,
  dir,
  className = "",
}) => {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    const list = options.filter((o) => o.en || o.ar);
    if (!q) return list.slice(0, 40);
    return list
      .filter((o) => {
        const en = (o.en || "").toLowerCase();
        const ar = (o.ar || "").toLowerCase();
        return en.includes(q) || ar.includes(q);
      })
      .slice(0, 40);
  }, [options, value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={wrapRef}>
      <label htmlFor={listId} className="form-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={listId}
          className={["form-input", className].filter(Boolean).join(" ")}
          value={value}
          dir={dir}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        />
        {open && filtered.length > 0 && (
          <ul
            className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            role="listbox"
          >
            {filtered.map((pair) => {
              const key = `${pair.en ?? ""}\0${pair.ar ?? ""}`;
              const text = labelFor(pair, lang);
              return (
                <li key={key}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    dir={dir}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onSelectPair(pair);
                      setOpen(false);
                    }}
                  >
                    {text}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
};

export default SuggestPairInput;
