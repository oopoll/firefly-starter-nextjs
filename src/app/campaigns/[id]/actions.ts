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
        /**
         * You can pass an external user id to track submissions by a specific user from your own database.
         */
        // externalUid: "some-opaque-user-id"
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

export async function listPhotoContestSubmissions(formId: string) {
  const { data: submissionsJson } = await client.GET(
    "/v1/forms/{id}/submissions",
    {
      params: {
        path: { id: formId },
        query: { pageSize: 100 },
      },
    }
  );

  return (
    submissionsJson?.data
      .flatMap((s) => s.fieldValues)
      .filter((fieldValue) => fieldValue.content !== null)
      .map((fieldValue) => {
        const content = fieldValue.content as components["schemas"]["Content"];
        const url =
          content.defaultVersion?.type === "IMAGE"
            ? content.defaultVersion.url
            : null;
        return {
          value: content.id,
          url,
        };
      }) ?? []
  );
}

export async function createPhotoContestSubmission(
  formId: string,
  fieldName: string,
  fileType: string
) {
  const { data, error } = await client.POST("/v1/forms/{id}/submissions", {
    params: {
      path: { id: formId },
    },
    body: {
      fields: {
        [fieldName]: fileType,
        /**
         * You can pass an external user id to track submissions by a specific user from your own database.
         */
        // externalUid: "some-opaque-user-id"
      },
    },
  });

  const uploadUrl = data?.uploads[fieldName].url;

  if (!uploadUrl) {
    console.error(error);
    return {
      error: "Failed to create a submission!",
    };
  }

  return { uploadUrl };
}
