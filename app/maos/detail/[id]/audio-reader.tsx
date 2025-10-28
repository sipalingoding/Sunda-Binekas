"use client";

import { ImVolumeHigh } from "react-icons/im";
import { useState } from "react";

export default function AudioReader({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
        isSpeaking ? "bg-red-600" : "bg-black"
      }`}
      title={isSpeaking ? "Stop audio" : "Play audio"}
    >
      <ImVolumeHigh size={15} color="white" />
    </button>
  );
}
