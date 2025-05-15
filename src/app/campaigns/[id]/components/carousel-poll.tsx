import { Button } from "@/components";

import {
  CampaignHeader,
  ContentCarousel,
  RadioGroup,
  StatusCard,
} from "@/components";
import { PollVariantProps } from "./types";
import { Card } from "@/components/card";
import { PollResults } from "@/types";

export function CarouselPoll({
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
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full justify-center">
      <div className="w-full lg:w-1/2">
        <ContentCarousel
          field={selectField}
          onSwipe={(value) => setSelection(value)}
          value={selection}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <Card>
          <CampaignHeader campaign={campaign} />
          {voted && (
            <>
              <VoteResults results={currentResults[0]} />
              <StatusCard title="Thanks for voting!" variant="success" />
            </>
          )}
          {error && <StatusCard title={error} variant="error" />}
          {!voted && (
            <>
              <RadioGroup
                options={selectField.options.map((option) => option.value)}
                className="mt-2"
                onChange={(value) => setSelection(value)}
                value={selection}
              />
              <Button
                isLoading={isLoading}
                disabled={!selection || isLoading}
                onClick={handleVote}
                className="min-w-[8rem]"
              >
                Cast Vote
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export interface VoteResultsProps {
  results: PollResults;
}

function VoteResults({ results }: VoteResultsProps) {
  const totalVotes = results.values.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {results.options.map((option) => {
        const voteCount =
          results.values.find((v) => v.value === option.value)?.count || 0;
        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

        return (
          <div key={option.value} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{option.value}</span>
              <span className="text-gray-500">{voteCount} votes</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)"
                style={{
                  width: `${percentage}%`,
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  animation:
                    "progressBar 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
