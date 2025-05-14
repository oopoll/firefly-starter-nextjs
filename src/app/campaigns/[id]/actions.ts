"use server";

import client from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type VoteResult =
  | {
      results: components["schemas"]["FormFieldAggregate"];
      error: null;
    }
  | {
      results: null;
      error: string;
    };

export async function vote(
  formId: string,
  fieldName: string,
  value: string
): Promise<VoteResult> {
  const { error: voteError } = await client.POST("/v1/forms/{id}/submissions", {
    params: {
      path: {
        id: formId,
      },
    },
    body: {
      fields: {
        [fieldName]: value,
      },
    },
  });

  if (voteError) {
    console.error(voteError.error?.messages?.join(","));
    return { error: "Something went wrong while voting!", results: null };
  }

  const { data: updatedAggregate } = await client.GET(
    "/v1/forms/{id}/fields/aggregate",
    {
      params: {
        path: {
          id: formId,
        },
      },
    }
  );
  const results = updatedAggregate?.data.find(
    (field) => field.name === fieldName
  );
  if (!results) {
    return {
      error: "Something went wrong while getting updated results!",
      results: null,
    };
  }

  return { error: null, results };
}
