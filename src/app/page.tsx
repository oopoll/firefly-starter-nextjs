import client from "@/lib/api-client";
import { TrophyIcon, ChartColumnBigIcon, SparklesIcon } from "lucide-react";
import { components } from "@/lib/api-schema";
import Link from "next/link";
import { getCampaignType } from "@/lib/campaign-utils";
import { Suspense } from "react";
import HomeLoading from "./loading";
import { Card, StatusCard } from "@/components";

async function CampaignList() {
  let campaigns: components["schemas"]["Campaign"][] = [];

  try {
    const { data: result, error } = await client.GET(
      "/v1/orgs/{name}/campaigns",
      {
        params: {
          path: {
            name: process.env.FIREFLY_ORG_NAME,
          },
          query: {
            pageSize: 10,
          },
        },
      }
    );

    if (error) {
      throw error;
    }

    campaigns = result?.data ?? [];
  } catch (error) {
    console.error(error);
    return (
      <StatusCard
        title="Error loading campaigns"
        subtitle="Are your environment variables setup correctly?"
        variant="error"
        className="max-w-prose mx-auto"
      >
        <div className="flex flex-col gap-1 mt-4">
          <pre>
            FIREFLY_ORG_NAME: {process.env.FIREFLY_ORG_NAME ?? "not set"}
          </pre>
          <pre>FIREFLY_API_KEY: {process.env.FIREFLY_API_KEY ?? "not set"}</pre>
          <pre>FIREFLY_API_URL: {process.env.FIREFLY_API_URL ?? "not set"}</pre>
        </div>
        <p className="mt-4 max-w-prose">
          Setup your environment variables by duplicating
          <code>.env.template</code> and renaming it to <code>.env.local</code>.
          Then replace any placeholder values with your own.
        </p>
      </StatusCard>
    );
  }

  const getIcon = (campaign: components["schemas"]["Campaign"]) => {
    switch (getCampaignType(campaign)) {
      case "poll":
        return <ChartColumnBigIcon className="w-6 h-6 text-blue-500" />;
      case "contest":
        return <TrophyIcon className="w-6 h-6 text-yellow-500" />;
      default:
        return <SparklesIcon className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Link
          href={`/campaigns/${campaign.id}`}
          key={campaign.id}
          className="block"
        >
          <Card className="bg-white hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              {getIcon(campaign)}
              <h2 className="text-xl font-semibold text-gray-900">
                {campaign.name}
              </h2>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
              {campaign.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {campaign.tags
                .filter((t) => !t.name.startsWith("ui:"))
                .map((tag) => (
                  <span
                    key={tag.name}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag.name}
                  </span>
                ))}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome!</h1>
        <p className="text-xl text-gray-600">
          Choose a sample campaign below to participate in.
        </p>
      </div>

      <Suspense fallback={<HomeLoading />}>
        <CampaignList />
      </Suspense>
    </div>
  );
}
