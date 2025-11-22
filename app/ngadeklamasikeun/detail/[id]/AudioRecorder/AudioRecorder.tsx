"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Upload, Mic, RefreshCcw } from "lucide-react"; // Import icon baru

export default function AudioRecorder({ dongengId }: { dongengId: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null); // URL untuk hasil rekaman Blob
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Blob untuk hasil rekaman

  // 🟢 State baru untuk upload file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  // Bersihkan semua state
  const resetAll = () => {
    setAudioURL(null);
    setAudioBlob(null);
    setSelectedFile(null);
  };

  // Mulai merekam
  const startRecording = async () => {
    // Check if file is selected
    if (selectedFile) return;

    try {
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
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType,
          });
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
    } catch (e) {
      console.log(e);
      toast({
        title: "Akses Mic Ditolak",
        description: "Mangga approve akses mikropon di browser.",
        variant: "destructive",
      });
    }
  };

  // Berhenti merekam
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // 🟢 Handle perubahan input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Error",
          description: "File harus berupa audio (MP3/WAV/etc).",
          variant: "destructive",
        });
        e.target.value = ""; // Clear input
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  // 🟢 Logika upload yang terpusat untuk Rekaman dan File
  const uploadAudio = async (fileToUpload: Blob | File) => {
    setIsUploading(true);

    const mime = fileToUpload.type;

    let extension = mime.split("/").pop() || "webm";
    if (fileToUpload instanceof File) {
      const parts = fileToUpload.name.split(".");
      if (parts.length > 1) {
        extension = parts.pop() as string;
      }
    }

    const fileName = `dongeng-${dongengId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("audio_dongeng")
      .upload(fileName, fileToUpload, {
        contentType: mime,
      });

    if (uploadError) {
      setIsUploading(false);
      toast({
        title: "Gagal Disimpen",
        description: `Error upload: ${uploadError.message}`,
        variant: "destructive",
      });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("audio_dongeng")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("dongeng")
      .update({ audio: publicUrl, status_audio: "pending" })
      .eq("id", dongengId);

    setIsUploading(false);
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

  // 🟢 Panggil uploadAudio dari tombol rekam
  const handleUploadRecording = () => {
    if (audioBlob) uploadAudio(audioBlob);
  };

  // 🟢 Panggil uploadAudio dari tombol file upload
  const handleUploadFile = () => {
    if (selectedFile) uploadAudio(selectedFile);
  };

  // Logika disable
  const isRecordingInProgress = isRecording || !!audioURL;
  const isFileSelected = !!selectedFile;

  return (
    <div className="flex flex-col gap-4 border-t border-gray-300 pt-6 mt-6">
      <h2 className="text-lg font-semibold">Rekam / Unggah Audio Dongeng</h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Kolom Perekam Suara */}
        <div
          className={`flex flex-col gap-3 p-4 border rounded-lg md:w-1/2 ${
            isRecordingInProgress ? "border-blue-500" : "border-gray-200"
          }`}
        >
          <h3 className="font-medium flex items-center gap-2">
            <Mic className="h-4 w-4" /> Perekam Suara
          </h3>

          {/* Tampilan Kontrol Perekam */}
          {!audioURL && !isFileSelected && (
            <div className="flex gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={isFileSelected}
                  className="w-full"
                >
                  🎙️ Mulai Rekam
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={stopRecording}
                  className="w-full"
                >
                  ⏹️ Berhenti Merekam
                </Button>
              )}
            </div>
          )}

          {/* Tampilan Hasil Rekaman */}
          {audioURL && (
            <div className="flex flex-col gap-3">
              <audio src={audioURL} controls className="w-full" />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetAll}
                  disabled={isUploading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" /> Ulangi
                </Button>
                <Button onClick={handleUploadRecording} disabled={isUploading}>
                  💾 Simpen Rekaman
                </Button>
              </div>
            </div>
          )}

          {/* Tampilan Jika File Terpilih, Perekam Dinonaktifkan */}
          {isFileSelected && (
            <p className="text-sm text-gray-500 italic">
              Perekam dinonaktifkan karena Anda memilih unggah file. Reset
              Unggahan untuk mengaktifkan lagi.
            </p>
          )}
        </div>

        {/* Kolom Upload File */}
        <div
          className={`flex flex-col gap-3 p-4 border rounded-lg md:w-1/2 ${
            isFileSelected ? "border-blue-500" : "border-gray-200"
          }`}
        >
          <h3 className="font-medium flex items-center gap-2">
            <Upload className="h-4 w-4" /> Unggah File Audio
          </h3>

          {/* Input File */}
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isRecordingInProgress || isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-black
              hover:file:bg-violet-100"
          />

          {/* Tampilan File Terpilih */}
          {selectedFile && (
            <div className="flex flex-col gap-3">
              <p className="text-sm">
                File: <strong>{selectedFile.name}</strong> (
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetAll}
                  disabled={isUploading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" /> Batalkan
                </Button>
                <Button onClick={handleUploadFile} disabled={isUploading}>
                  💾 Unggah File
                </Button>
              </div>
            </div>
          )}

          {/* Tampilan Jika Rekaman Aktif, Upload Dinonaktifkan */}
          {isRecordingInProgress && !audioURL && (
            <p className="text-sm text-gray-500 italic">
              Unggahan file dinonaktifkan selama perekaman aktif.
            </p>
          )}

          {/* Tampilan Jika Audio Sudah Direkam */}
          {audioURL && (
            <p className="text-sm text-gray-500 italic">
              Unggahan file dinonaktifkan karena rekaman audio sudah selesai.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
