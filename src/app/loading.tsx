import { Skeleton } from "@/components";

export default function HomeLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
          <div className="flex flex-col gap-2 mb-4 flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2 mt-auto">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
