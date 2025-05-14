import { AlertCircleIcon, CheckIcon } from "lucide-react";
import classNames from "classnames";

export interface StatusCardProps {
  title: string;
  variant?: "success" | "error";
}

export function StatusCard({ title, variant = "success" }: StatusCardProps) {
  const getIcon = () => {
    if (variant === "success") {
      return <CheckIcon className="w-5 h-5 text-green-600" />;
    }
    return <AlertCircleIcon className="w-5 h-5 text-red-600" />;
  };
  return (
    <div
      className={classNames(
        "w-full mt-4 p-4 rounded-lg flex items-center gap-3",
        variant === "success"
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      )}
    >
      <div className="bg-green-100 p-2 rounded-lg">{getIcon()}</div>
      <div>
        <h3
          className={classNames(
            "font-semibold",
            variant === "success" ? "text-green-800" : "text-red-800"
          )}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
