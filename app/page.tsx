"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TfiWrite } from "react-icons/tfi";
import { MdGroups2 } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [dataStatistik, setDataStatistik] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataStatistik();
  }, []);

  const getDataStatistik = async () => {
    try {
      const resp = await fetch("/api/users/total");
      const json = await resp.json();
      setDataStatistik(json);
    } catch (err) {
      console.error("Gagal mengambil data statistik:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 rounded-xl px-6 sm:px-10 lg:px-16 py-10 gap-4 flex flex-col">
        {/* TEKS INTRO */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">Wilujeng Sumping!</h1>
          <h5 className="italic text-base sm:text-lg">
            Nyukcruk Sasakala Lembur
          </h5>
          <h2 className="font-bold text-lg sm:text-xl">Dongéng Tatar Sunda</h2>
        </div>

        {/* DESKRIPSI */}
        <div className="flex flex-col gap-2 text-sm sm:text-base leading-relaxed">
          <p>
            PUKIS mangrupa platform digital berbasis peta interaktif pikeun
            maluruh cerita rakyat ti unggal daérah di Jawa Barat. Sistem website
            ieu dirancang partisipatif, artina boh guru, siswa, atawa masyarakat
            umum bisa milu kontribusi nuliskeun cerita rakyat kalayan mékanismeu
            Wikipédia.
          </p>
          <p>
            Dongéng mangrupa carita rékaan anu méré kesan pamohalan tur
            ukuranana parondok, ditulis dina wangun prosa. Dongéng sumebar ti
            hiji jalma ka jalma liana sacara lisan, tur teu kapanggih saha nu
            ngarangna. Lantaran sumebar dina wangun lisan, téks dongéng babari
            robah atawa leungit. Jenis-jenis dongéng diantarana fable (carita
            sasatoan), parable (carita kahirupan jalma), sasakala (legenda),
            sage (babad), mite (mitos).
          </p>
        </div>

        {/* STATISTIC SECTION */}
        <div className="mt-auto flex justify-center">
          <div
            className="
            bg-[#fafafa]
            w-full sm:w-auto
            p-4 sm:p-6
            rounded-xl
            flex flex-col sm:flex-row
            justify-center
            gap-6 sm:gap-16
            shadow-sm
            text-center
          "
          >
            {loading ? (
              // 🟢 Skeleton Loading
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 animate-pulse"
                  >
                    <div className="flex gap-2 items-center justify-center text-lg font-semibold">
                      <div className="w-5 h-5 bg-gray-300 rounded-full" />
                      <div className="w-6 h-4 bg-gray-300 rounded" />
                    </div>
                    <div className="w-16 h-3 bg-gray-200 rounded" />
                  </div>
                ))}
              </>
            ) : (
              // 🟣 Data Statistik
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-2 items-center justify-center text-lg font-semibold">
                    <TfiWrite />
                    <span>{dataStatistik?.total_kontributor ?? 0}</span>
                  </div>
                  <span className="text-sm text-gray-600">Kontributor</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-2 items-center justify-center text-lg font-semibold">
                    <MdGroups2 />
                    <span>{dataStatistik?.total_view ?? 0}</span>
                  </div>
                  <span className="text-sm text-gray-600">Ditingali</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-2 items-center justify-center text-lg font-semibold">
                    <GiOpenBook />
                    <span>{dataStatistik?.total_dongeng ?? 0}</span>
                  </div>
                  <span className="text-sm text-gray-600">Dongeng</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
