import { useMemo } from "react";
import { useCryptoStore } from "../store";

export const CryptoPriceDisplay = () => {
  const result = useCryptoStore((state) => state.result);
  const hasResult = useMemo(() => Object.values(result).includes(""), [result]);

  return (
    <div>
      {hasResult && (
        <>
          <h2>Cotización</h2>
          <div>
            <p>
              El precio es de:{result.} <span>{result.PRICE}</span>
            </p>
            <p>

            </p>
            <p>

            </p>
          </div>
        </>
      )}
    </div>
  );
};
