import { useEffect } from "react";
import { useCryptoStore } from "../store";

export const CryptoPriceDisplay = ({ pair }: { pair: { from: string; to: string } }) => {
  const { result, fetchData, isLoading, error } = useCryptoStore((state) => ({
    result: state.result,
    fetchData: state.fetchData,
    isLoading: state.isLoading,
    error: state.error,
  }));

  // Llamamos a fetchData al montar el componente
  useEffect(() => {
    fetchData(pair);
  }, [fetchData, pair]);

  if (isLoading) return <p>Cargando cotización...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!result) return <p>No hay datos disponibles</p>;

  return (
    <div className="result-wrapper">
      <h2>Cotización</h2>
      <section className="result">
        <img
          className="logoCrypto"
          src={`https://www.cryptocompare.com${result.IMAGEURL}`}
          alt="Imagen Criptomoneda"
        />
        <section>
          <p>El precio es de: <span>{result.PRICE}</span></p>
          <p>Precio más alto del día: <span>{result.HIGHDAY}</span></p>
          <p>Precio más bajo del día: <span>{result.LOWDAY}</span></p>
          <p>Cambio en las últimas 24 horas: <span>{result.CHANGEPCT24HOUR}</span></p>
          <p>Última actualización: <span>{result.LASTUPDATE}</span></p>
        </section>
      </section>
    </div>
  );
};
