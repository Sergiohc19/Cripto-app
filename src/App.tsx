import { useEffect } from "react";
import "./index.css"
import { CriptoSearchForm } from "./components/CriptoSearchForm";
import { useCryptoStore } from "./store";
import { CryptoPriceDisplay } from "./components/CryptoPriceDisplay";
import { CryptoChartDisplay } from "./components/CryptoChartDisplay"; // ✅ Usa el componente contenedor

export const App = () => {
  const fetchCryptos = useCryptoStore((state) => state.fetchCryptos);
  const hasQuoted = useCryptoStore((state) => state.hasQuoted);

  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  return (
    <div className="container">
      <h1 className="app-title">
        Cotizador de <span>Criptomonedas</span>
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
