import { AlertCircleIcon, CheckIcon } from "lucide-react";
import classNames from "classnames";

export interface StatusCardProps {
  title: string;
  subtitle?: string;
  variant?: "success" | "error";
  children?: React.ReactNode;
  className?: string;
}

export function StatusCard({
  title,
  subtitle,
  variant = "success",
  children,
  className,
}: StatusCardProps) {
  const getIcon = () => {
    if (variant === "success") {
      return <CheckIcon className="w-5 h-5 text-green-600" />;
    }
    return <AlertCircleIcon className="w-5 h-5 text-red-600" />;
  };

  return (
    <div
      className={classNames(
        "w-full mt-4 p-4 rounded-lg flex items-start gap-3",
        className,
        variant === "success"
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      )}
    >
      <div
        className={classNames(
          "p-2 rounded-lg",
          variant === "success" ? "bg-green-100" : "bg-red-100"
        )}
      >
        {getIcon()}
      </div>
      <div>
        <h3
          className={classNames(
            "font-semibold",
            variant === "success" ? "text-green-800" : "text-red-800"
          )}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={classNames(
              "text-sm",
              variant === "success" ? "text-green-600" : "text-red-600"
            )}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
