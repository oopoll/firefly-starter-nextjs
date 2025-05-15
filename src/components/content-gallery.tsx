"use client";

import { useState } from "react";
import Image from "next/image";
import Modal, { ModalContent } from "./modal";
import { components } from "@/lib/api-schema";
import { FileQuestionIcon } from "lucide-react";

type PollResults = Pick<
  components["schemas"]["FormFieldAggregate"],
  "options" | "values"
>;

interface Content {
  url: string | null;
  value: string;
  onClick?: (id: string) => void;
}

export interface ContentGalleryProps {
  content: Content[];
  className?: string;
  enableModal?: boolean;
  showValues?: boolean;
  showSelection?: boolean;
  results?: PollResults;
  showResults?: boolean;
  onSelect?: (value: string) => void;
}

export function ContentGallery({
  content,
  className,
  enableModal = true,
  showValues = true,
  showSelection = false,
  results,
  showResults = false,
  onSelect,
}: ContentGalleryProps) {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
      >
        {content.map((item) => (
          <div
            key={item.value}
            className={`flex flex-col ${
              showSelection && selectedContent?.value === item.value
                ? "border-2 border-blue-500 rounded-xl"
                : ""
            }`}
            onClick={() => {
              if (enableModal) {
                setIsOpen(true);
              }
              setSelectedContent(item);
              onSelect?.(item.value);
            }}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
              {item.url ? (
                <Image
                  src={item.url}
                  alt="Gallery image"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized={item.url.includes(".gif")}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <FileQuestionIcon className="w-10 h-10 text-gray-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {showResults && results && (
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                  {(() => {
                    const totalVotes = results.values.reduce(
                      (sum, v) => sum + v.count,
                      0
                    );
                    const voteCount =
                      results.values.find((v) => v.value === item.value)
                        ?.count || 0;
                    const percentage =
                      totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

                    return (
                      <div className="space-y-1">
                        <div className="flex justify-between text-white text-sm">
                          <span>{voteCount} votes</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
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
                  })()}
                </div>
              )}
            </div>
            {showValues && item.value && (
              <div className="mt-2 text-center">
                <span
                  className={`inline-block px-3 py-1 text-sm font-bold tracking-wider ${
                    showSelection && selectedContent?.value === item.value
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-800 bg-gray-100"
                  } rounded-full shadow-sm hover:bg-gray-200 transition-colors duration-300`}
                >
                  {item.value}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        setIsOpen={(open) => {
          if (!open) {
            setTimeout(() => {
              setSelectedContent(null);
            }, 150);
          }
          setIsOpen(open);
        }}
        isOpen={isOpen}
      >
        <ModalContent className="w-fit h-fit max-w-[90vw] max-h-[90vh] p-0! bg-transparent!">
          {selectedContent?.url && (
            <Image
              src={selectedContent.url}
              alt="Enlarged view"
              width={600}
              height={400}
              priority
              className="object-contain max-w-[90vw] max-h-[90vh]"
              unoptimized={selectedContent.url?.includes(".gif")}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
