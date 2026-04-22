"use client";

import { useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AudioRecorder({ dongengId, userId }: { dongengId: string; userId?: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  const resetAll = () => { setAudioURL(null); setAudioBlob(null); setSelectedFile(null); };

  const startRecording = async () => {
    if (selectedFile) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/ogg") ? "audio/ogg" : "audio/webm";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        setTimeout(() => {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          if (blob.size === 0) { alert("Gagal merekam. Browser mungkin tidak mendukung format ini."); return; }
          setAudioBlob(blob);
          setAudioURL(URL.createObjectURL(blob));
        }, 300);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({ title: "Akses Mic Ditolak", description: "Mangga approve akses mikropon di browser.", variant: "destructive" });
    }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.type.startsWith("audio/")) {
      toast({ title: "Format Salah", description: "File kedah audio (MP3/WAV/etc).", variant: "destructive" });
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const uploadAudio = async (fileToUpload: Blob | File) => {
    setIsUploading(true);
    const mime = fileToUpload.type;
    let ext = mime.split("/").pop() || "webm";
    if (fileToUpload instanceof File) {
      const parts = fileToUpload.name.split(".");
      if (parts.length > 1) ext = parts.pop() as string;
    }
    const fileName = `dongeng-${dongengId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("audio_dongeng").upload(fileName, fileToUpload, { contentType: mime });
    if (uploadError) {
      setIsUploading(false);
      toast({ title: "Gagal Disimpen", description: uploadError.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from("audio_dongeng").getPublicUrl(fileName);
    const { error: insertError } = await supabase.from("ngupingkeun_list").insert({ file_audio: urlData.publicUrl, status: "pending", dongeng_id: dongengId, user_id: userId });
    setIsUploading(false);
    if (insertError) {
      toast({ title: "Gagal Disimpen", description: "Error nyimpen audio rekaman", variant: "destructive" });
    } else {
      toast({ title: "Rekaman Parantos Disimpen", description: "Audio bakal dikupingkeun ku kurator heula sateuacan aya di menu ngupingkeun.", variant: "success" });
      router.replace("/ngadeklamasikeun");
    }
  };

  const isRecordingInProgress = isRecording || !!audioURL;
  const isFileSelected = !!selectedFile;

  return (
    <div className="ar-wrap">
      <div className="ar-head">
        <span className="ar-eyebrow">Kontribusi Audio</span>
        <div className="ar-title">Rekam / Unggah Audio Dongéng</div>
      </div>

      <div className="ar-body">
        {/* Panel Rekam */}
        <div className="ar-panel">
          <div className="ar-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            Perekam Sora
          </div>

          {isFileSelected && (
            <p className="ar-panel-muted">Perekam dinonaktifkan — anjeun milih unggah file. Reset unggahan pikeun ngaktifkeun deui.</p>
          )}

          {!audioURL && !isFileSelected && (
            <>
              {!isRecording ? (
                <button className="ar-btn ar-btn-primary" onClick={startRecording}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  Mimiti Rekam
                </button>
              ) : (
                <button className="ar-btn ar-btn-danger" onClick={stopRecording}>
                  <div className="ar-recording-dot" />
                  Eureun Rekam
                </button>
              )}
            </>
          )}

          {audioURL && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <audio src={audioURL} controls style={{ width: "100%", borderRadius: 10 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ar-btn ar-btn-outline" style={{ flex: 1 }} onClick={resetAll} disabled={isUploading}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                  </svg>
                  Ulangi
                </button>
                <button className="ar-btn ar-btn-primary" style={{ flex: 1 }} onClick={() => audioBlob && uploadAudio(audioBlob)} disabled={isUploading}>
                  {isUploading ? (
                    <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                  Simpen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel Upload */}
        <div className="ar-panel">
          <div className="ar-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Unggah File Audio
          </div>

          {isRecordingInProgress && !audioURL && (
            <p className="ar-panel-muted">Unggahan file dinonaktifkan salami perekaman aktif.</p>
          )}
          {audioURL && (
            <p className="ar-panel-muted">Unggahan file dinonaktifkan — rekaman audio parantos réngsé.</p>
          )}

          {!isRecordingInProgress && (
            <input
              type="file"
              accept="audio/*"
              className="ar-file-input"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          )}

          {selectedFile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="ar-file-info">
                <strong>{selectedFile.name}</strong><br />
                {Math.round(selectedFile.size / 1024)} KB
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ar-btn ar-btn-outline" style={{ flex: 1 }} onClick={resetAll} disabled={isUploading}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  Batalkeun
                </button>
                <button className="ar-btn ar-btn-primary" style={{ flex: 1 }} onClick={() => selectedFile && uploadAudio(selectedFile)} disabled={isUploading}>
                  {isUploading ? (
                    <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                  Unggah
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
