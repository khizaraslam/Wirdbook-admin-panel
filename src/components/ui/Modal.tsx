import React, { useCallback, useEffect } from "react";
import { X } from "lucide-react";
import useOutsideClick from "@/hooks/click-outside-hook";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Stable callback for useOutsideClick
  const handleOutside = useCallback(() => {
    if (isOpen) onClose();
  }, [isOpen, onClose]);

  // Attaches to the modal content box — fires only when click starts outside it
  const contentRef = useOutsideClick<HTMLDivElement>(handleOutside);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      style={{ zIndex: "var(--z-modal)" }}
    >
      {/* Backdrop — purely visual, no click handler needed */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className={`relative bg-white rounded-2xl max-h-[90vh] shadow-2xl w-full overflow-auto modal-enter ${
          className.includes("max-w-") ? "" : "max-w-xl"
        } ${className}`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
