import classNames from "classnames";
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames("border border-gray-200 rounded-lg p-3 sm:p-4", className)}
    >
      {children}
    </div>
  );
