"use client";

import { components } from "@/lib/api-schema";
import { useState } from "react";
import { ContentCarousel, ContentGallery, RadioGroup } from "@/components";
import { getUiTags } from "@/lib/campaign-utils";
import { VoteResults } from "./vote-results";
import { Button } from "@/components";
import { vote } from "./actions";
import { StatusCard } from "@/components";

export interface PollContainerProps {
  campaign: components["schemas"]["Campaign"];
  form: components["schemas"]["Form"];
  results: components["schemas"]["FormFieldAggregate"][];
}

export function PollContainer({ campaign, form, results }: PollContainerProps) {
  const [selection, setSelection] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [voted, setVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResults, setCurrentResults] = useState(results);
  const selectField = form.fields.find((field) => field.type === "SELECT");
  const uiTags = getUiTags(campaign);

  if (!selectField) {
    throw new Error("Select field not found");
  }

  const handleVote = async () => {
    if (!selection) {
      return;
    }

    setIsLoading(true);

    const voteResult = await vote(form.id, selectField.name, selection);

    if (voteResult.error !== null) {
      console.error(voteResult.error);
      setError(voteResult.error);
    } else {
      setCurrentResults([voteResult.results]);
      setVoted(true);
    }

    setIsLoading(false);
  };

  if (uiTags.includes("carousel")) {
    return (
      <CarouselPoll
        campaign={campaign}
        selectField={selectField}
        voted={voted}
        setSelection={setSelection}
        selection={selection}
        error={error}
        isLoading={isLoading}
        handleVote={handleVote}
        currentResults={currentResults}
      />
    );
  }

  if (uiTags.includes("gallery")) {
    return (
      <GalleryPoll
        campaign={campaign}
        selectField={selectField}
        voted={voted}
        setSelection={setSelection}
        selection={selection}
        error={error}
        isLoading={isLoading}
        handleVote={handleVote}
        currentResults={currentResults}
      />
    );
  }
}

interface PollVariantProps {
  campaign: components["schemas"]["Campaign"];
  selectField: components["schemas"]["FormField"];
  voted: boolean;
  setSelection: (value: string) => void;
  selection: string | undefined;
  error: string | undefined;
  isLoading: boolean;
  handleVote: () => void;
  currentResults: components["schemas"]["FormFieldAggregate"][];
}

function CarouselPoll({
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
        <div>
          <h2 className="text-2xl font-bold mb-2">{campaign.name}</h2>
          {campaign.publishDate && (
            <h3 className="text-sm text-gray-500">
              {new Date(campaign.publishDate).toLocaleDateString()}
            </h3>
          )}
          <p className="text-sm text-gray-500">{campaign.description}</p>
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
                className="mt-4"
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
        </div>
        {/* {filler.type === "poll" && voted && !user && <SignInCta />} */}
      </div>
    </div>
  );
}

function GalleryPoll({
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
    <div>
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl font-bold text-center">{campaign.name}</h1>
        <h2 className="text-sm text-gray-500 text-center">
          {campaign.description}
        </h2>
        {campaign.publishDate && (
          <h3 className="text-sm text-gray-500 text-center">
            {new Date(campaign.publishDate).toLocaleDateString()}
          </h3>
        )}
      </div>
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
        {/* {voted && !user && <SignInCta className="w-full" />} */}
      </div>
    </div>
  );
}
