import axios from "axios";
import { CryptoCurrencyResponseSchema, CryptoPriceSchema } from "../schema/crypto-schema";
import type { Pair } from "../types";

export async function getCryptos() {
  const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";
  const { data: { Data } } = await axios(url);

  // Validar uno por uno
  const validCryptos = Data.filter((item: unknown) => {
    const result = CryptoCurrencyResponseSchema.safeParse(item);
    return result.success;
  });

  console.log(`Recibidas: ${Data.length}, Válidas: ${validCryptos.length}`);
  return validCryptos;
}

export async function fetchCurrentCryptoPrice(pair: Pair) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.cryptocurrency}&tsyms=${pair.currency}`;
  const { data: { DISPLAY } } = await axios(url);
  
  const result = CryptoPriceSchema.safeParse(DISPLAY[pair.cryptocurrency][pair.currency]);
  
  if (result.success) {
    console.log("Precio:", result.data);
    return result.data;
  }

  throw new Error("No se pudo obtener el precio.");
}
