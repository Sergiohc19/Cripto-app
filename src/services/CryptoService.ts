/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CryptoCurrencyResponseSchema, CryptoPriceSchema } from "../schema/crypto-schema";
import type { Pair } from "../types";

// Lista de memecoins o tokens no deseados que queremos EXCLUIR
const MEMECOIN_BLACKLIST = [
  "PEPE", "BONK", "WIF", "FLOKI", "TURBO", "MOG", "ELON", "SAITO", "MYRO", "BOME",
  "NFT", "NOT", "PENGU", "MOTHER", "HIPPO", "ACT", "SATS", "ORDI", "REDO", "MAGA",
  "TRUMP", "COQ", "DADDY", "HARAMBE", "WOJAK", "SC", "SHI", "MEX", "AIDOGE", "BANANA",
  "TOSHI", "DOGINME", "SPX", "Brett", "NEIRO", "GORK", "SNEK", "FWOG", "GOAT", "DADDY",
  "MUMU", "RATS", "POPCAT", "MEW", "CAT", "HOT", "ZEREBRO", "LADYS", "SILLY", "BANAN"
];

export async function getCryptos() {
  // Traemos 100 para tener margen y poder filtrar/rellenar
  const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD";

  try {
    const { data: { Data } } = await axios.get(url);

    // Fase 1: Filtrar criptos "serias"
    const filteredCryptos = Data.filter((item: any) => {
      const symbol = item?.CoinInfo?.Internal;
      const usdData = item?.RAW?.USD;

      // Requisitos mínimos
      if (!symbol || !usdData) return false;

      // Excluir memecoins
      if (MEMECOIN_BLACKLIST.includes(symbol)) return false;

      // Volumen mínimo de $30 millones (ajustable si necesitas más)
      if ((usdData.VOLUME24HOURTO || 0) < 30_000_000) return false;

      // Validar con tu esquema Zod
      const result = CryptoCurrencyResponseSchema.safeParse(item);
      return result.success;
    });

    // Tomamos máximo 30 de las que pasaron el filtro
    let finalList = filteredCryptos.slice(0, 30);

    // Fase 2: Si no llegamos a 30, rellenamos con las siguientes del top 100 (sin duplicados)
    if (finalList.length < 30) {
      const remaining = 30 - finalList.length;

      const backupCryptos = Data.filter((item: any) => {
        const symbol = item?.CoinInfo?.Internal;
        // Solo incluir si NO está ya en la lista final
        return symbol && !finalList.some((f: { CoinInfo: { Internal: any; }; }) => f.CoinInfo?.Internal === symbol);
      }).slice(0, remaining);

      finalList = [...finalList, ...backupCryptos];
    }

    return finalList;

  } catch (error) {
    console.error("Error al obtener criptomonedas:", error);
    throw new Error("No se pudieron cargar las criptomonedas confiables.");
  }
}

export async function fetchCurrentCryptoPrice(pair: Pair) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.cryptocurrency}&tsyms=${pair.currency}`;

  try {
    const { data: { DISPLAY } } = await axios.get(url);

    const priceData = DISPLAY?.[pair.cryptocurrency]?.[pair.currency];
    if (!priceData) {
      throw new Error(`Precio no disponible para ${pair.cryptocurrency}/${pair.currency}`);
    }

    const result = CryptoPriceSchema.safeParse(priceData);

    if (result.success) {
      return result.data;
    }

    throw new Error("No se pudo validar el precio.");
  } catch (error) {
    console.error("Error al obtener precio:", error);
    throw new Error("No se pudo obtener el precio.");
  }
}

export async function fetchCryptoHistory(pair: Pair) {
  const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${pair.cryptocurrency}&tsym=${pair.currency}&limit=24`;

  try {
    const response = await axios.get(url);

    const rawData = response.data?.Data?.Data || [];

    if (!Array.isArray(rawData)) {
      throw new Error("Formato de datos histórico inválido");
    }

    return rawData.map((point: any) => ({
      time: point.time,
      close: point.close,
    }));
  } 
  catch (error) {
    console.error("Error al obtener histórico:", error);
    throw new Error("No se pudo obtener el histórico.");
  }
}