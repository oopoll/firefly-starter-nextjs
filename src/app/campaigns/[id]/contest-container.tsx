import { components } from "@/lib/api-schema";

export interface ContestContainerProps {
  campaign: components["schemas"]["Campaign"];
  form: components["schemas"]["Form"];
}

export function ContestContainer({ campaign, form }: ContestContainerProps) {
  return <div></div>;
}
