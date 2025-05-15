import { X } from "lucide-react";
import React from "react";

export interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function ModalContent({
  children,
  className = "",
  isOpen,
  setIsOpen,
}: ModalContentProps) {
  return (
    <div className={`bg-white rounded-lg p-10 w-full relative ${className}`}>
      <button
        onClick={() => setIsOpen?.(false)}
        className="hover:cursor-pointer absolute -top-12 right-2 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full p-2 shadow-md"
      >
        <X className="w-5 h-5" />
      </button>
      {children}
    </div>
  );
}

export default function Modal({ children, setIsOpen, isOpen }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative  max-w-[90vw] flex items-center justify-center">
        <div
          className={`w-full flex items-center justify-center transition-all duration-300 transform ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement<ModalContentProps>(child) &&
              child.type === ModalContent
            ) {
              return React.cloneElement(child, { isOpen, setIsOpen });
            }
            return child;
          })}
        </div>
      </div>
    </div>
  );
}
