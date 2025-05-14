import React from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Keyboard } from "swiper/modules";
import { useMemo, useRef, useEffect } from "react";
import ContentCarouselSlide from "./content-carousel-slide";
import { components } from "@/lib/api-schema";
import "swiper/css";

export interface ContentCarouselProps {
  onSwipe?: (value: string) => void;
  field: components["schemas"]["FormField"];
  className?: string;
  value?: string;
}

export function ContentCarousel({
  field,
  onSwipe,
  value,
}: ContentCarouselProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (value && swiperRef.current) {
      const index = field.options.findIndex((option) => option.value === value);
      if (index !== -1) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [value, field.options]);

  const handleSlideChange = (swiper: SwiperClass) => {
    // Pause all videos with error handling
    videoRefs.current.forEach((video) => {
      if (video) {
        try {
          video.pause();
        } catch (error) {
          // Ignore pause errors
        }
      }
    });

    // Play the current video if it's a video slide
    const currentOption = field.options[swiper.activeIndex];
    if (currentOption.content?.type === "VIDEO") {
      const currentVideo = videoRefs.current[swiper.activeIndex];
      if (currentVideo) {
        try {
          const playPromise = currentVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Ignore failed play attempts
            });
          }
        } catch (error) {
          // Ignore playback errors
        }
      }
    }

    onSwipe?.(currentOption.value);
  };

  const slides = useMemo(() => {
    return field.options.map((option, index) => {
      return (
        <SwiperSlide key={option.value}>
          <ContentCarouselSlide
            type={option.content?.type ?? undefined}
            media={option.content?.defaultVersion ?? undefined}
            autoPlay={index === 0}
            ref={(el) => {
              if (el?.querySelector("video")) {
                videoRefs.current[index] = el.querySelector("video");
              }
            }}
          />
        </SwiperSlide>
      );
    });
  }, [field]);

  return (
    <Swiper
      className="max-w-4xl"
      modules={[EffectCoverflow, Keyboard]}
      keyboard={true}
      effect="coverflow"
      centeredSlides={true}
      slidesPerView={1.2}
      breakpoints={{
        640: {
          slidesPerView: 1.5,
        },
      }}
      onSlideChange={handleSlideChange}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
      }}
    >
      {slides}
    </Swiper>
  );
}
