import classNames from "classnames";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames(
        "animate-pulse rounded-md bg-slate-900/10 dark:bg-slate-50/10",
        className
      )}
      {...props}
    />
  );
}
