import { components } from "@/lib/api-schema";

export interface PollVariantProps {
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
