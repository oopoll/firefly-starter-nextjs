import { Skeleton } from "@/components";
import { Card } from "@/components/card";

export default function CampaignPageLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-6 w-full md:w-1/2">
        <Skeleton className="col-span-1 row-span-1  aspect-square" />
        <Skeleton className="col-span-1 row-span-1  aspect-square" />
        <Skeleton className="col-span-1 row-span-1  aspect-square" />
        <Skeleton className="col-span-1 row-span-1  aspect-square" />
        <Skeleton className="col-span-1 row-span-1  aspect-square" />
      </div>
      <Card className="w-full md:w-1/2">
        <Skeleton className="h-10 w-2/3 mb-2" />
        <Skeleton className="h-5 w-1/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <Skeleton className="h-32 w-full mt-4" />
      </Card>
    </div>
  );
}
