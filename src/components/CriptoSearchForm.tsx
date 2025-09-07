import { useState, useEffect, useRef } from "react";
import { useCryptoStore } from "../store";
import { currencies } from "../data";
import type { Pair } from "../types";
import { ErrorMessage } from "./ErrorMessage";

export const CriptoSearchForm = () => {
  const cryptocurrencies = useCryptoStore((state) => state.cryptocurrencies);
  const fetchCryptos = useCryptoStore((state) => state.fetchCryptos);
  const fetchData = useCryptoStore((state) => state.fetchData);
  const setHasQuoted = useCryptoStore((state) => state.setHasQuoted);

  const [pair, setPair] = useState<Pair>({
    currency: "",
    cryptocurrency: "",
  });

  const [error, setError] = useState("");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const cryptoRef = useRef<HTMLDivElement>(null);

  // Cargar criptomonedas al montar
  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  const topCryptocurrencies = cryptocurrencies.slice(0, 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pair.currency || !pair.cryptocurrency) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    fetchData(pair);
    setHasQuoted(true); // Mostrar resultado
  };

  // Cerrar dropdowns al hacer clic fuera
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

  const handleCurrencySelect = (currCode: string) => {
    setPair((prev) => ({ ...prev, currency: currCode }));
    setError("");
    setHasQuoted(false);
    setIsCurrencyOpen(false);
  };

  const handleCryptoSelect = (cryptoName: string) => {
    setPair((prev) => ({ ...prev, cryptocurrency: cryptoName }));
    setError("");
    setHasQuoted(false);
    setIsCryptoOpen(false);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Selector de Moneda */}
      <div className="field">
        <label>Moneda:</label>
        <div
          ref={currencyRef}
          className="custom-select"
          onClick={() => setIsCurrencyOpen((open) => !open)}
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
                    handleCurrencySelect(curr.code);
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
          onClick={() => setIsCryptoOpen((open) => !open)}
        >
          <div className="select-trigger">
            {pair.cryptocurrency
              ? cryptocurrencies.find(
                  (c) => c.CoinInfo.Name === pair.cryptocurrency
                )?.CoinInfo.FullName
              : "-- Seleccione --"}
          </div>

          {isCryptoOpen && (
            <ul className="select-options">
              {topCryptocurrencies.map((crypto) => (
                <li
                  key={crypto.CoinInfo.Name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCryptoSelect(crypto.CoinInfo.Name);
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
