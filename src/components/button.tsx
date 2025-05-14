import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({
  children,
  isLoading = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`justify-center bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 flex items-center gap-2 hover:bg-blue-600 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-fit md:px-8 ${className}`}
      {...props}
    >
      <span className="min-h-[1.5rem] min-w-[1.5rem] flex items-center justify-center">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </span>
    </button>
  );
}
