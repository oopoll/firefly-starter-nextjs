export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
      {children}
    </div>
  );
}
