"use client";

import { Card } from "@/components/card";
import { components } from "@/lib/api-schema";
import { Loader2 } from "lucide-react";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { ContentGallery, ContentGalleryProps, StatusCard } from "@/components";
import { createPhotoContestSubmission } from "./actions";

export interface ContestContainerProps {
  campaign: components["schemas"]["Campaign"];
  form: components["schemas"]["Form"];
  submissions: ContentGalleryProps["content"];
}

export function ContestContainer({
  campaign,
  form,
  submissions,
}: ContestContainerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState<boolean>(false);

  const contentField = form.fields.find((f) => f.type === "CONTENT");
  if (!contentField) {
    throw new Error("Content field not found");
  }

  const handleUploadClick = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    const upload = await createPhotoContestSubmission(
      form.id,
      contentField.name,
      file.type
    );

    if (upload.error !== undefined) {
      setError(upload.error);
      setIsUploading(false);
      return;
    }

    const uploadResponse = await fetch(upload.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      setError("Failed to upload photo");
      setIsUploading(false);
      return;
    }

    setDone(true);
    setIsUploading(false);
  };

  return (
    <div className="flex lg:flex-row gap-4 lg:gap-8 w-full justify-center flex-col-reverse">
      <div className="w-full lg:w-1/2">
        <ContentGallery
          content={submissions}
          enableModal={true}
          showValues={false}
          showSelection={false}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <Card>
          <h2 className="text-2xl font-bold mb-2">{campaign.name}</h2>
          {campaign.publishDate && (
            <h3 className="text-sm text-gray-500">
              {new Date(campaign.publishDate).toLocaleDateString()}
            </h3>
          )}
          <p className="text-sm text-gray-500 mt-2">{campaign.description}</p>
          {!done && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <UploadIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">
                    Submit your photo
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Must be a{" "}
                    {contentField.acceptedMimeTypes
                      .map((t) => t.split("/").pop())
                      .join(", ")}{" "}
                    less than 5MB
                  </p>
                </div>
              </div>
              <input
                ref={inputRef}
                type="file"
                onChange={handleUpload}
                accept={contentField.acceptedMimeTypes.join(", ")}
                className="hidden"
              />
              {!done && (
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading || done}
                  className="mt-4 w-full bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-4 h-4" />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          {error && (
            <StatusCard title="Error" subtitle={error} variant="error" />
          )}
          {done && (
            <StatusCard
              title="Thanks for submitting!"
              subtitle="Your submission will be processed soon, and you'll be notified if you win!"
              variant="success"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
