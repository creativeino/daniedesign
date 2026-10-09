// Video component with reliable autoplay using IntersectionObserver.
// Plays automatically when the video enters the viewport (muted + playsInline).
// Shows a play/pause button overlay for manual control.
"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { resolveMediaUrl } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  fill?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "auto" | "metadata" | "none";
  controls?: boolean;
  showButton?: boolean;
  buttonClassName?: string;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
};

export default function MediaVideo({
  src: rawSrc,
  poster,
  className = "",
  fill = false,
  autoPlay,
  loop,
  muted,
  playsInline = true,
  preload = "metadata",
  controls = false,
  showButton = true,
  buttonClassName = "bottom-3 right-3",
  onLoadedMetadata,
}: Props) {
  const src = resolveMediaUrl(rawSrc);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // IntersectionObserver + immediate attempt — play when visible, pause when off-screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    // Force required attributes on the DOM element directly (crucial for browser autoplay policies)
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playSafe = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setPlaying(true))
          .catch(() => {
            // Autoplay was blocked or element not yet ready; will try again on intersection
            setPlaying(false);
          });
      }
    };

    // If already in view on mount, play immediately
    const rect = video.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      playSafe();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playSafe();
          } else {
            video.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.1 } // start playing as soon as 10% is visible
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, autoPlay]);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <div className={fill ? "absolute inset-0" : "relative h-full w-full"}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted ?? autoPlay}   // muted must be true for autoplay to work
        playsInline={playsInline}   // required on iOS Safari
        preload={preload}
        controls={controls}
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className={`h-full w-full ${className}`.trim()}
      />
      {showButton && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className={`absolute z-20 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] ${buttonClassName}`}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
