"use client";

interface RadioGroupProps {
  options: string[];
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
}

export function RadioGroup({
  options,
  onChange,
  className,
  value,
}: RadioGroupProps) {
  const handleOptionChange = (option: string) => {
    onChange?.(option);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {options.map((option) => (
        <div
          key={option}
          onClick={() => handleOptionChange(option)}
          className={`
              flex items-center gap-3 p-4 rounded-lg cursor-pointer
              transition-all duration-200
              ${value === option ? "bg-blue-600/10" : "hover:bg-blue-600/5"}
            `}
        >
          <div
            className={`
              w-5 h-5 rounded-full border-2
              flex items-center justify-center
              ${value === option ? "border-blue-500" : "border-blue-400"}
            `}
          >
            {value === option && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            )}
          </div>
          <span>{option}</span>
        </div>
      ))}
    </div>
  );
}
