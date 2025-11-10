"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AudioRecorder({ dongengId }: { dongengId: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  // Mulai merekam
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : MediaRecorder.isTypeSupported("audio/ogg")
      ? "audio/ogg"
      : "audio/webm";

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      setTimeout(() => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log("🎧 Blob size:", audioBlob.size);
        if (audioBlob.size === 0) {
          alert("Gagal merekam. Browser mungkin tidak mendukung format ini.");
          return;
        }
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(url);
      }, 300);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // Berhenti merekam
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Ulangi rekaman
  const resetRecording = () => {
    setAudioURL(null);
    setAudioBlob(null);
  };

  // Simpan ke Supabase
  const uploadRecording = async () => {
    if (!audioBlob)
      return toast({
        title: "Error nyimpen rekaman",
        description: "Teu acan aya file audio anu direkam",
        variant: "destructive",
      });

    const fileName = `dongeng-${dongengId}-${Date.now()}.webm`;
    const { data, error } = await supabase.storage
      .from("audio_dongeng") // pastikan kamu punya bucket bernama 'audio'
      .upload(fileName, audioBlob, {
        contentType: "audio/webm",
      });

    if (error) {
      toast({
        title: "Gagal Disimpen",
        description: "Error nyimpen",
        variant: "destructive",
      });
    }

    // ambil URL publik
    const { data: publicUrlData } = supabase.storage
      .from("audio_dongeng")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // update ke tabel 'dongeng'
    const { error: updateError } = await supabase
      .from("dongeng")
      .update({ audio: publicUrl, status_audio: "pending" })
      .eq("id", dongengId);

    if (updateError) {
      toast({
        title: "Rekaman Gagal Disimpen",
        description: "Error nyimpen audio rekaman",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Rekaman Parantos Disimpen",
        description:
          "Audio rekaman bade dikupingkeun heula ku kurator, pami sae tiasa di kupingkeun di menu ngupingkeun",
        variant: "success",
      });

      router.replace("/ngadeklamasikeun");
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-gray-300 pt-6 mt-6">
      <h2 className="text-lg font-semibold">Rekam Audio Dongeng</h2>

      {!audioURL && (
        <div className="flex gap-3">
          {!isRecording ? (
            <Button onClick={startRecording}>🎙️ Mulai Rekam</Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              ⏹️ Berhenti
            </Button>
          )}
        </div>
      )}

      {audioURL && (
        <div className="flex flex-col gap-3">
          <audio src={audioURL} controls className="w-full" />
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetRecording}>
              🔁 Ulangi
            </Button>
            <Button onClick={uploadRecording}>💾 Simpen Rekaman</Button>
          </div>
        </div>
      )}
    </div>
  );
}
