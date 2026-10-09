// Video player with a play/pause toggle overlaid on the video.
//
// Drop-in replacement for a bare <video>: same sizing/className behaviour as
// MediaImage, plus a floating button so galleries, admin previews and the
// media library can start/stop playback without native controls.
"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  /** Media URL (backend upload or Blob-proxied). */
  src: string;
  /** Cover image shown until playback starts (falls back when video is loading). */
  poster?: string;
  /** Classes applied to the <video> element (object-fit, filters…). */
  className?: string;
  /** Position the wrapper absolutely inside a relative parent (matches MediaImage). */
  fill?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "auto" | "metadata" | "none";
  /** Native scrubber/volume bar (kept for the lightbox). */
  controls?: boolean;
  /** Render the play/pause overlay button. */
  showButton?: boolean;
  /** Placement of the button, e.g. "bottom-3 right-3" (default) or "top-3 right-3". */
  buttonClassName?: string;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
};

export default function MediaVideo({
  src,
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPlaying(true))
          .catch(() => {
            // Autoplay blocked or waiting for user interaction
            setPlaying(false);
          });
      }
    }
  }, [src, autoPlay]);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Keep the click from bubbling into gallery/lightbox/Link navigation.
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
        muted={muted ?? autoPlay}
        playsInline={playsInline}
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
