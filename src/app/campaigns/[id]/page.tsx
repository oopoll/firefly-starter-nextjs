import client from "@/lib/api-client";
import { notFound } from "next/navigation";
import { getCampaignType } from "@/lib/campaign-utils";
import { listPhotoContestSubmissions } from "./actions";
import { Suspense } from "react";
import CampaignPageLoading from "./loading";
import { PollContainer } from "./components/poll-container";
import { ContestContainer } from "./components/contest-container";

export interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export async function CampaignPageContent({
  campaignId,
}: {
  campaignId: string;
}) {
  // Fetch the campaign
  const { data: campaign, response } = await client.GET(`/v1/campaigns/{id}`, {
    params: { path: { id: campaignId } },
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
    params: { path: { id: campaignId } },
  });
  const form = forms?.data[0];
  if (!form) {
    notFound();
  }

  if (campaignType === "poll") {
    return <PollContainer campaign={campaign} form={form} />;
  }

  const photoSubmissions = await listPhotoContestSubmissions(form.id);

  return (
    <ContestContainer
      campaign={campaign}
      form={form}
      submissions={photoSubmissions}
    />
  );
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<CampaignPageLoading />}>
      <CampaignPageContent campaignId={id} />
    </Suspense>
  );
}
