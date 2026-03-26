import Image from "next/image";
import React from "react";

const WartaPage = () => {
  return (
    <div
      className="flex flex-col gap-6 px-6 py-12 sm:px-12 md:px-16 lg:px-24 xl:px-32 bg-cover bg-center bg-no-repeat h-full"
      style={{ backgroundImage: "url('/images/bghome.png')" }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Iber</h1>

      <p className="text-sm sm:text-base leading-relaxed text-gray-700">
        Iber atawa béja singget ngeunaan ieu website ngawengku iber ngeunaan
        saha anu nyieunna, saha waé anu kontribusina, jeung sajabana.
        <br />
        Ieu website diinisiasi ku tim inovasi SMKN 1 Rancah kalayan gawé bareng
        jeung sababaraha pihak, diantarana website developer Saloka Mandala
        Karya, dirojong ku Forum Musyawarah guru Bahasa Sunda sarta komunitas
        budaya ogé sastra Sunda lianna. Ieu website masih dina proses
        pengembangan, kukituna fitur-fiturna can lengkep sakabéhna.
        <br />
        Sementawis ieu website masih kénéh dikembangkeun, kukituna fitur-fiturna
        can lengkep sakabéhna.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 mt-8 sm:mt-16">
        <Image src={"/images/logo1.png"} width={100} height={100} alt="logo1" className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain" />
        <Image src={"/images/logo3.png"} width={100} height={100} alt="logo3" className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain" />
        <Image src={"/images/logo4.png"} width={100} height={100} alt="logo4" className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain" />
        <div className="rounded-lg shadow-md bg-gray-500 p-1">
          <Image
            src={"/images/logo5.png"}
            width={80}
            height={80}
            alt="logo5"
            className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default WartaPage;
