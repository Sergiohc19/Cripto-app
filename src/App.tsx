import { useEffect } from "react";
import "./index.css"
import { CriptoSearchForm } from "./components/CriptoSearchForm";
import { useCryptoStore } from "./store";
import { CryptoPriceDisplay } from "./components/CryptoPriceDisplay";
import { CryptoChartDisplay } from "./components/CryptoChartDisplay"; // ✅ Usa el componente contenedor



// ✅ NUEVO: Componente de fondo de video
const VideoBackground = () => {
  return (
    <div className="video-background">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/backgroundCrypto.mp4" type="video/mp4" />
        Tu navegador no soporta videos de fondo.
      </video>
    </div>
  );
};

export const App = () => {
  const fetchCryptos = useCryptoStore((state) => state.fetchCryptos);
  const hasQuoted = useCryptoStore((state) => state.hasQuoted);

  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);




  return (


    <div className="container">

      <VideoBackground /> {/* Agrega el fondo de video */}
      <h1 className="app-title">
       Crypto<span>ValueTracker</span>
      </h1>

      <section className="content">
        <CriptoSearchForm />
      </section>

      {hasQuoted && (
        <>
          <section className="container-results">
            <article className="content-result">
              <CryptoPriceDisplay />
            </article>

            <article>
              <CryptoChartDisplay />
            </article>
          </section>
        </>
      )}


    </div>
  );
};
