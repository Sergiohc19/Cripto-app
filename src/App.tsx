import { useEffect } from "react";
import { CriptoSearchForm } from "./components/CriptoSearchForm";
import { useCryptoStore } from "./store";
import { CryptoPriceDisplay } from "./components/CryptoPriceDisplay";



export const App = () => {

  const fetchCryptos = useCryptoStore((state) => state.fetchCryptos)

  useEffect(() => {
    fetchCryptos()
  }, [fetchCryptos])

  return (
    <div className="container">
      <h1 className="app-title">
        Cotizador de <span>Criptomonedas</span>
      </h1>

      <section className="content">
        <CriptoSearchForm />


      </section>
      <section className="content-result">
        <CryptoPriceDisplay />
        </section>
    </div>
  );
};
