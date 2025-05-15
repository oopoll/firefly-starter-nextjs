import { components } from "./api-schema";

export type CampaignType = "poll" | "contest" | "unknown";

/**
 * Get the campaign type from the campaign
 *
 * We can utilize campaign tags to categorize campaigns
 *
 * @param campaign The campaign to get the type from
 * @returns The campaign type
 */
export function getCampaignType(
  campaign: components["schemas"]["Campaign"]
): CampaignType {
  const isPoll = campaign.tags.find((t) => t.name === "Poll");
  if (isPoll) return "poll";

  const isContest = campaign.tags.find((t) => t.name === "Contest");
  if (isContest) return "contest";

  return "unknown";
}

/**
 * Get the UI tags from the campaign
 *
 * We can utilize campaign tags to determine the type of UI to display
 *
 * @param campaign The campaign to get the UI tags from
 * @returns The UI tags from the campaign
 */
export function getUiTags(campaign: components["schemas"]["Campaign"]) {
  return campaign.tags
    .filter((t) => t.name.startsWith("ui:"))
    .map((t) => t.name.split(":")[1]);
}
