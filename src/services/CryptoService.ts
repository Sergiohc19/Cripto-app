import axios from "axios";
import { CryptoCurrencyResponseSchema, CryptoPriceSchema } from "../schema/crypto-schema";
import type { Pair } from "../types";

export async function getCryptos() {
  const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";
  const { data: { Data } } = await axios(url);

  // Validar cada item con el esquema
  const validCryptos = Data.filter((item: unknown) => {
    const result = CryptoCurrencyResponseSchema.safeParse(item);
    return result.success;
  });

  // Retornar máximo 20 criptos validadas
  return validCryptos.slice(0, 20);
}

export async function fetchCurrentCryptoPrice(pair: Pair) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.cryptocurrency}&tsyms=${pair.currency}`;
  const { data: { DISPLAY } } = await axios(url);

  const result = CryptoPriceSchema.safeParse(DISPLAY[pair.cryptocurrency][pair.currency]);

  if (result.success) {
    return result.data;
  }

  throw new Error("No se pudo obtener el precio.");
}


export async function fetchCryptoHistory(pair: Pair) {
  const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${pair.cryptocurrency}&tsym=${pair.currency}&limit=24`;

  const response = await axios.get(url);

  // La data está en response.data.Data.Data (sí, doble Data)
  const rawData = response.data.Data.Data;

  // Devolver un array con { time, close } para el gráfico
  return rawData.map((point: any) => ({
    time: point.time,
    close: point.close,
  }));
}