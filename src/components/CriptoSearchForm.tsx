import { useState, useEffect, useRef } from "react";
import { useCryptoStore } from "../store";
import { currencies } from "../data";
import type { Pair } from "../types";
import { ErrorMessage } from "./ErrorMessage";

export const CriptoSearchForm = () => {
  const cryptocurrencies = useCryptoStore((state) => state.cryptocurrencies);

  // ✅ Eliminamos los estados duplicados: usamos SOLO `pair`
  const [pair, setPair] = useState<Pair>({
    currency: "",
    cryptoCurrency: "",
  });

  const [error, setError] = useState("")
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);

  // Referencias a los contenedores
  const currencyRef = useRef<HTMLDivElement>(null);
  const cryptoRef = useRef<HTMLDivElement>(null);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!pair.currency || !pair.cryptoCurrency) {
    setError("Todos los campos son obligatorios");
    return;
  }

  setError(""); // ✅ Limpia si todo está bien
  console.log("Cotizando:", pair);
};

  // Efecto para cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setIsCurrencyOpen(false);
      }

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

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {/* Selector de Moneda */}
      <div className="field">
        <label>Moneda:</label>
        <div
          ref={currencyRef}
          className="custom-select"
          onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
          // ❌ Eliminamos onChange
        >
          <div className="select-trigger">
            {pair.currency
              ? currencies.find((c) => c.code === pair.currency)?.name
              : "-- Seleccione --"}
          </div>

          {isCurrencyOpen && (
            <ul className="select-options">
              {currencies.map((curr) => (
                <li
                  key={curr.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPair({ ...pair, currency: curr.code });
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
          // ❌ Eliminamos onChange
        >
          <div className="select-trigger">
            {pair.cryptoCurrency
              ? cryptocurrencies.find(
                  (c) => c.CoinInfo.Name === pair.cryptoCurrency
                )?.CoinInfo.FullName
              : "-- Seleccione --"}
          </div>

          {isCryptoOpen && (
            <ul className="select-options">
              {cryptocurrencies.map((crypto) => (
                <li
                  key={crypto.CoinInfo.Name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPair({ ...pair, cryptoCurrency: crypto.CoinInfo.Name });
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

      <button type="submit">Cotizar</button>
    </form>
  );
};