import { useEffect, useState } from "react";
import { CriptoSearchForm } from "./components/CriptoSearchForm";
import { useCryptoStore } from "./store";
import { CryptoPriceDisplay } from "./components/CryptoPriceDisplay";

export const App = () => {
  const fetchCryptos = useCryptoStore((state) => state.fetchCryptos);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  const handleQuote = () => {
    setShowResult(true);
  };

  return (
    <div className="container">
      <h1 className="app-title">
        Cotizador de <span>Criptomonedas</span>
      </h1>

      <section className="content">
        <CriptoSearchForm onQuote={handleQuote} />
      </section>

      {showResult && (
        <section className="content-wrapper">
          <CryptoPriceDisplay />
        </section>
      )}
    </div>
  );
};