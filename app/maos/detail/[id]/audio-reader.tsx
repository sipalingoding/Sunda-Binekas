"use client";

import React, { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface AudioReaderProps {
  audioUrl: string;
}

export default function AudioReader({ audioUrl }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <Button
        onClick={togglePlay}
        className="rounded-full bg-gray-700 hover:bg-gray-800 text-white p-3"
      >
        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
      </Button>
    </div>
  );
}
