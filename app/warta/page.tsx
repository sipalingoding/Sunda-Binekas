import Image from "next/image";
import React from "react";

const WartaPage = () => {
  return (
    <div className="sb-warta paper-bg fade-enter">
      <div className="sb-warta-inner">

        {/* Left — copy */}
        <div className="sb-warta-copy">
          <div className="sb-hero-eyebrow">
            <span className="dot" />
            Iber &amp; Béja
          </div>
          <h1>
            Ngeunaan<br />
            <em>Sunda</em>{" "}
            <span className="swash">Binekas.</span>
          </h1>
          <p className="lead">
            Iber singget ngeunaan ieu website — saha anu nyieunna, saha anu
            kontribusina, jeung kumaha rarancangna ka hareup.
          </p>

          <div className="sb-warta-desc">
            <p>
              Ieu website diinisiasi ku tim inovasi{" "}
              <strong>SMKN 1 Rancah</strong> kalayan gawé bareng jeung sababaraha
              pihak, diantarana website developer{" "}
              <strong>Saloka Mandala Karya</strong>.
            </p>
            <p>
              Dirojong ku Forum Musyawarah Guru Bahasa Sunda sarta komunitas
              budaya ogé sastra Sunda lianna. Ieu website masih kénéh dina
              proses pengembangan, kukituna fitur-fiturna can lengkep
              sakabéhna.
            </p>
          </div>
        </div>

        {/* Right — partners card */}
        <div className="sb-warta-card">
          <div className="sb-warta-card-head">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Dirojong ku
          </div>

          <div className="sb-warta-logos">
            <div className="sb-warta-logo-item">
              <Image
                src="/images/logo1.png"
                width={80}
                height={80}
                alt="logo1"
                className="sb-warta-logo-img"
              />
            </div>
            <div className="sb-warta-logo-item">
              <Image
                src="/images/logo3.png"
                width={80}
                height={80}
                alt="logo3"
                className="sb-warta-logo-img"
              />
            </div>
            <div className="sb-warta-logo-item">
              <Image
                src="/images/logo4.png"
                width={80}
                height={80}
                alt="logo4"
                className="sb-warta-logo-img"
              />
            </div>
            <div className="sb-warta-logo-item sb-warta-logo-dark">
              <Image
                src="/images/logo5.png"
                width={70}
                height={70}
                alt="logo5"
                className="sb-warta-logo-img"
              />
            </div>
          </div>

          <div className="sb-warta-status">
            <span className="sb-warta-status-dot" />
            Masih dina proses pangwangunan
          </div>
        </div>

      </div>
    </div>
  );
};

export default WartaPage;
