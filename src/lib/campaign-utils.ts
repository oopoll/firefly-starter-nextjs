import { components } from "./api-schema";

export type CampaignType = "poll" | "contest" | "unknown";

export function getCampaignType(
  campaign: components["schemas"]["Campaign"]
): CampaignType {
  const isPoll = campaign.tags.find((t) => t.name === "Poll");
  if (isPoll) return "poll";

  const isContest = campaign.tags.find((t) => t.name === "Contest");
  if (isContest) return "contest";

  return "unknown";
}

export function getUiTags(campaign: components["schemas"]["Campaign"]) {
  return campaign.tags
    .filter((t) => t.name.startsWith("ui:"))
    .map((t) => t.name.split(":")[1]);
}
