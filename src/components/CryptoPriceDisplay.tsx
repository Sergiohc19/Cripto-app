import { useMemo, useState, useEffect } from "react";
import { useCryptoStore } from "../store";
import { CryptoPriceChart } from "./CryptoPriceChart";

export const CryptoPriceDisplay = () => {
  const result = useCryptoStore((state) => state.result);
  const [historicalData, setHistoricalData] = useState<{ time: number; close: number }[]>([]);

  // Verificamos que el objeto tenga datos y no campos vacíos
  const hasResult = useMemo(() => {
    return result && Object.keys(result).length > 0 && !Object.values(result).includes("");
  }, [result]);

  // TODO: Aquí deberías hacer fetch de datos históricos para alimentar el gráfico
  // Simulación temporal de datos de ejemplo para gráfico
  useEffect(() => {
    if (hasResult) {
      // Ejemplo de datos históricos (últimas 24h cada hora)
      const exampleData = Array.from({ length: 24 }, (_, i) => ({
        time: Math.floor(Date.now() / 1000) - (23 - i) * 3600,
        close: parseFloat(result.PRICE.replace(/[^0-9.-]+/g,"")) * (0.95 + 0.1 * Math.random()), // pequeño random
      }));
      setHistoricalData(exampleData);
    }
  }, [hasResult, result.PRICE]);

  return (
    <div className="result-wrapper">
      {hasResult && (
        <>
          <h2>Cotización</h2>
          <div className="result">
            <img
              src={`https://cryptocompare.com/${result.IMAGEURL}`}
              alt="Imagen Cryptomoneda"
            />
            <div>
              <p>El precio es de: <span>{result.PRICE}</span></p>
              <p>Precio más alto del día: <span>{result.HIGHDAY}</span></p>
              <p>Precio más bajo del día: <span>{result.LOWDAY}</span></p>
              <p>Variación últimas 24 horas: <span>{result.HIGH24HOUR}</span></p>
              <p>Última actualización: <span>{result.LASTUPDATE}</span></p>
            </div>
          </div>

          <h3>Precio en las últimas 24 horas</h3>
          <CryptoPriceChart data={historicalData} />
        </>
      )}
    </div>
  );
};
