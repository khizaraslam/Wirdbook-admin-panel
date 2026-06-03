import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Rendered above the input as a `<label>` */
  label?: string;
  /** Helper text rendered below the input */
  hint?: string;
  /** Error message — turns the border red when present */
  error?: string;
  /**
   * When true, applies the muted background variant (`.form-input-muted`)
   * useful for auto-generated / read-lighter fields like a slug.
   */
  muted?: boolean;
  /** Element rendered on the right side inside the input (e.g. eye icon) */
  rightElement?: React.ReactNode;
}

/**
 * Reusable, forwardRef-based Input component.
 * Fully compatible with React Hook Form's `register()`.
 *
 * Styling is driven by global CSS classes (`index.css`):
 *  - .form-label  — label typography
 *  - .form-input  — base input style
 *  - .form-input-muted — subdued variant for secondary fields
 *  - .form-hint   — small helper text
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      muted = false,
      rightElement,
      id,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Derive an accessible id from the label when none is given
    const inputId = id ?? label?.toLowerCase().replace(/[\s*]+/g, "-");

    const inputClass = [
      "form-input",
      muted ? "form-input-muted" : "",
      error ? "!border-red-400 focus:!border-red-400 !ring-red-100" : "",
      rightElement ? "pr-12" : "",
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

        <div className="relative">
          <input ref={ref} id={inputId} className={inputClass} {...props} />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {/* Show error taking priority over hint */}
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

Input.displayName = "Input";

export default Input;
