"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Komentar {
  id: string;
  isi: string;
  created_at: string;
  user_id: string;
  user?: {
    id: string;
    username?: string;
    email?: string;
  };
}

export default function KomentarForm({ dongengId }: { dongengId: string }) {
  const [isi, setIsi] = useState("");
  const [komentar, setKomentar] = useState<Komentar[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchKomentar = async () => {
    try {
      const res = await fetch(`/api/komentar?dongeng_id=${dongengId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat komentar");
      setKomentar(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKomentar();
  }, [dongengId]);

  const handleSubmitKomentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isi.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const resp = await fetch("/api/komentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dongeng_id: dongengId, isi }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Gagal mengirim komentar");

      setIsi("");
      setSuccessMsg("Komentar berhasil dikirim!");
      fetchKomentar();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitKomentar} className="space-y-3">
        <Textarea
          placeholder="Mangga bilih bade ngomentar ieu carita dihaturanan"
          rows={4}
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
        />
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        <div className="w-full flex justify-end">
          <Button
            type="submit"
            disabled={!isi.trim() || loading}
            className="px-3 bg-green-800 text-white"
          >
            {loading ? "Ngirim..." : "Kirim"}
          </Button>
        </div>
      </form>
      <div className="space-y-3 mt-6">
        {
          komentar.map((k) => (
            <Card key={k.id} className="shadow-sm">
              <CardHeader className="p-3 pb-1">
                <p className="text-sm text-gray-500">
                  {k.user?.username || "Anonim"} •{" "}
                  {new Date(k.created_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p>{k.isi}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
