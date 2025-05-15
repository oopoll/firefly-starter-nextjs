import { CampaignHeader } from "@/components/campaign-header";
import { ContentGallery } from "@/components";
import { PollVariantProps } from "./types";
import { Button, StatusCard } from "@/components";

export function GalleryPoll({
  campaign,
  selectField,
  voted,
  setSelection,
  selection,
  error,
  isLoading,
  handleVote,
  currentResults,
}: PollVariantProps) {
  const options = selectField.options.map((o) => {
    return {
      value: o.value,
      url:
        o.content?.defaultVersion?.type === "IMAGE"
          ? o.content?.defaultVersion?.url
          : "",
    };
  });
  return (
    <div className="max-w-7xl mx-auto">
      <CampaignHeader
        campaign={campaign}
        className="mb-4 sm:mb-8 text-center"
      />
      <ContentGallery
        className="mt-4"
        content={options}
        enableModal={false}
        showSelection={!voted}
        showResults={voted}
        results={currentResults?.[0]}
        onSelect={(value) => setSelection(value)}
      />
      <div className="mt-6 flex flex-col gap-4 items-center justify-center max-w-md mx-auto">
        {voted ? (
          <div className="w-full mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">
                Thanks for voting!
              </h3>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <Button
              isLoading={isLoading}
              disabled={!selection || isLoading}
              onClick={handleVote}
            >
              Cast Vote
            </Button>
          </div>
        )}
        {error && <StatusCard title={error} variant="error" />}
      </div>
    </div>
  );
}
