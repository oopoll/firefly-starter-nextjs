import client from "@/lib/api-client";
import { TrophyIcon, ChartColumnBigIcon, SparklesIcon } from "lucide-react";
import { components } from "@/lib/api-schema";
import Link from "next/link";
import { getCampaignType } from "@/lib/campaign-utils";

export default async function Home() {
  const { data: result } = await client.GET("/v1/orgs/{name}/campaigns", {
    params: {
      path: {
        name: process.env.FIREFLY_ORG_NAME,
      },
      query: {
        pageSize: 10,
      },
    },
  });

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Campaigns
          </h1>
          <p className="text-xl text-gray-600">
            Choose a campaign to participate in
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result?.data.map((campaign) => (
            <Link
              href={`/campaigns/${campaign.id}`}
              key={campaign.id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full flex flex-col">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
