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
    </div>
  );
};

export default WartaPage;
