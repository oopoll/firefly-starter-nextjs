import client from "@/lib/api-client";
import { notFound } from "next/navigation";
import { PollContainer } from "./poll-container";
import { getCampaignType } from "@/lib/campaign-utils";
import { ContestContainer } from "./contest-container";

export interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;

  // Fetch the campaign
  const { data: campaign, response } = await client.GET(`/v1/campaigns/{id}`, {
    params: { path: { id } },
  });

  if (!campaign) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Something went wrong!");
  }

  const campaignType = getCampaignType(campaign);

  if (campaignType === "unknown") {
    notFound();
  }

  // Get the campaign form (assuming there's only one)
  const { data: forms } = await client.GET("/v1/campaigns/{id}/forms", {
    params: { path: { id } },
  });
  const form = forms?.data[0];
  if (!form) {
    notFound();
  }

  if (campaignType === "poll") {
    // Get field aggregate data from the form to display poll results
    const { data: aggregateData } = await client.GET(
      "/v1/forms/{id}/fields/aggregate",
      {
        params: { path: { id: form.id } },
      }
    );

    const results = aggregateData?.data;
    if (!results) {
      notFound();
    }

    return <PollContainer campaign={campaign} form={form} results={results} />;
  }

  return <ContestContainer campaign={campaign} form={form} />;
}
