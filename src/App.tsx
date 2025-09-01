import { useEffect } from "react";
import { CriptoSearchForm } from "./components/CriptoSearchForm";
import { useCryptoStore } from "./store";



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

      <div className="content">
        <CriptoSearchForm />
      </div>
    </div>
  );
};
