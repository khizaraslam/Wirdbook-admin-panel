import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = "", rows = 4, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/[\s*]+/g, "-");

    const inputClass = [
      "form-input min-h-[100px] py-3 resize-y",
      error ? "!border-red-400 focus:!border-red-400 !ring-red-100" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={inputClass}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-red-500 mt-1.5 ml-1 font-semibold leading-tight error-message">
            {error}
          </p>
        ) : hint ? (
          <p className="form-hint">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
