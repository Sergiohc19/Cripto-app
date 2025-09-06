import { useMemo } from "react";
import { useCryptoStore } from "../store";
import "../index.css"

export const CryptoPriceDisplay = () => {
  const result = useCryptoStore((state) => state.result);

  const hasResult = useMemo(() => {
    return (
      result &&
      Object.keys(result).length > 0 &&
      !Object.values(result).includes("")
    );
  }, [result]);

  return (
    <>
      {hasResult && (

        <div className="result-wrapper">
          <h2>Cotización</h2>
          <section className="content-wrapper">

          <img
            src={`https://cryptocompare.com/${result.IMAGEURL}`}
            alt="Imagen Cryptomoneda"
          />
          <div>
            <p>
              El precio es de: <span>{result.PRICE}</span>
            </p>
            <p>
              Precio más alto del día: <span>{result.HIGHDAY}</span>
            </p>
            <p>
              Precio más bajo del día: <span>{result.LOWDAY}</span>
            </p>
            <p>
              Variación últimas 24 horas: <span>{result.HIGH24HOUR}</span>
            </p>
            <p>
              Última actualización: <span>{result.LASTUPDATE}</span>
            </p>
          </div>
          </section>
        </div>
        
      )}
    </>
  );
};
