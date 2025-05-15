"use client";

import { components } from "@/lib/api-schema";
import { useState } from "react";
import { getUiTags } from "@/lib/campaign-utils";
import { vote } from "../actions";
import { GalleryPoll } from "./gallery-poll";
import { CarouselPoll } from "./carousel-poll";
import { PollResults } from "@/types";

export interface PollContainerProps {
  campaign: components["schemas"]["Campaign"];
  form: components["schemas"]["Form"];
}

export function PollContainer({ campaign, form }: PollContainerProps) {
  const [selection, setSelection] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [voted, setVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResults, setCurrentResults] = useState<PollResults[]>([]);
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
