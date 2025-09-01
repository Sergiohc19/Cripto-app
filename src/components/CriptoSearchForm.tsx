import { useState, useEffect, useRef } from "react";
import { useCryptoStore } from "../store";
import { currencies } from "../data";

export const CriptoSearchForm = () => {
  const cryptocurrencies = useCryptoStore((state) => state.cryptocurrencies);

  const [currency, setCurrency] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);

  // Referencias a los contenedores de cada desplegable
  const currencyRef = useRef<HTMLDivElement>(null);
  const cryptoRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currency || !cryptoCurrency) return;
    console.log("Cotizando:", { currency, cryptoCurrency });
    // Aquí puedes llamar a una acción del store, por ejemplo:
    // useCryptoStore.getState().fetchPrice({ currency, cryptoCurrency });
  };

  // Efecto para cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Si el clic fue fuera del selector de moneda → cerrar
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setIsCurrencyOpen(false);
      }

      // Si el clic fue fuera del selector de criptomoneda → cerrar
      if (cryptoRef.current && !cryptoRef.current.contains(target)) {
        setIsCryptoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* Selector de Moneda */}
      <div className="field">
        <label>Moneda:</label>
        <div
          ref={currencyRef}
          className="custom-select"
          onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
        >
          <div className="select-trigger">
            {currency
              ? currencies.find((c) => c.code === currency)?.name
              : "-- Seleccione --"}
          </div>

          {isCurrencyOpen && (
            <ul className="select-options">
              {currencies.map((curr) => (
                <li
                  key={curr.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrency(curr.code);
                    setIsCurrencyOpen(false);
                  }}
                >
                  {curr.name} ({curr.code})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Selector de Criptomoneda */}
      <div className="field">
        <label>Criptomoneda:</label>
        <div
          ref={cryptoRef}
          className="custom-select"
          onClick={() => setIsCryptoOpen(!isCryptoOpen)}
        >
          <div className="select-trigger">
            {cryptoCurrency
              ? cryptocurrencies.find((c) => c.CoinInfo.Name === cryptoCurrency)
                  ?.CoinInfo.FullName
              : "-- Seleccione --"}
          </div>

          {isCryptoOpen && (
            <ul className="select-options">
              {cryptocurrencies.map((crypto) => (
                <li
                  key={crypto.CoinInfo.FullName}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCryptoCurrency(crypto.CoinInfo.Name);
                    setIsCryptoOpen(false);
                  }}
                >
                  {crypto.CoinInfo.FullName} ({crypto.CoinInfo.Name})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <input type="submit" value="Cotizar" />
    </form>
  );
};