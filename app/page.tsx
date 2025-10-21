import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TfiWrite } from "react-icons/tfi";
import { MdGroups2 } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex-1 rounded-xl px-16 py-10 gap-4 flex flex-col">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Wilujeng Sumping!</h1>
          <h5 className="italic">Nyukcruk Sasakala Lembur</h5>
          <h2 className="font-bold">Dongéng Tatar Sunda</h2>
        </div>

        <div className="flex flex-col gap-2">
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
            robah atawa leungit. Robahna téks téh alatan aya anu dihaja jeung
            teu dihaja. Jenis-jenis dongéng diantarana fable (carita sasatoan),
            parable (carita kahirupan jalma), sasakala (legenda), sage (babad),
            mite (mitos).
          </p>
        </div>

        {/* STATISTIC SECTION */}
        <div className="mt-auto flex justify-center">
          <div className="bg-[#fafafa] w-fit p-4 rounded-xl flex justify-center gap-16 shadow-sm">
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-2 items-center text-lg font-semibold">
                <TfiWrite />
                <span>9</span>
              </div>
              <span className="text-sm text-gray-600">Kontributor</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-2 items-center text-lg font-semibold">
                <MdGroups2 />
                <span>100222</span>
              </div>
              <span className="text-sm text-gray-600">Ditingali</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-2 items-center text-lg font-semibold">
                <GiOpenBook />
                <span>10</span>
              </div>
              <span className="text-sm text-gray-600">Dongeng</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
