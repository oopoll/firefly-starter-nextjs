import React, { forwardRef, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "lucide-react";
import Image from "next/image";

export interface ContentCarouselSlideProps {
  type: string;
  autoPlay?: boolean;
  media: string;
}

const ContentCarouselSlide = forwardRef<
  HTMLDivElement,
  ContentCarouselSlideProps
>(({ type, media, autoPlay = false }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.paused) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Ignore failed play attempts
            });
          }
        } else {
          videoRef.current.pause();
        }
      } catch (error) {
        // Ignore playback errors
      }
    }
  };

  return (
    <div
      ref={ref}
      className="aspect-[9/13] rounded-lg overflow-hidden relative"
    >
      {type === "IMAGE" && (
        <Image src={media} alt="Content" className="object-cover" />
      )}
      {type === "VIDEO" && (
        <div className="relative w-full h-full" onClick={togglePlay}>
          <video
            ref={(ref) => {
              if (ref) {
                videoRef.current = ref;
                // Don't set currentTime here as it can cause issues on mobile
              }
            }}
            src={media}
            loop
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay={autoPlay}
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            playsInline
            controls={false}
            muted
          />
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isPaused ? "scale-100" : "scale-0"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              {isPaused ? (
                <PlayIcon className="w-8 h-8 text-white" />
              ) : (
                <PauseIcon className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </div>
      )}
      {typeof media === "string" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white">{media}</p>
        </div>
      )}
    </div>
  );
});

ContentCarouselSlide.displayName = "ContentCarouselSlide";

export default ContentCarouselSlide;
