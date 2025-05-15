import { components } from "@/lib/api-schema";
import classNames from "classnames";

export interface CampaignHeaderProps {
  className?: string;
  campaign: components["schemas"]["Campaign"];
}

export function CampaignHeader({ campaign, className }: CampaignHeaderProps) {
  return (
    <div className={classNames("flex flex-col gap-1", className)}>
      <h1 className="text-xl font-bold">{campaign.name}</h1>
      <h2 className=" text-gray-500">{campaign.description}</h2>
      {campaign.publishDate && (
        <h3 className="text-sm text-gray-500">
          {new Date(campaign.publishDate).toLocaleDateString()}
        </h3>
      )}
    </div>
  );
}
