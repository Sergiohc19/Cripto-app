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

function getApiKey() {
  const key = import.meta.env.VITE_CRYPTO_API_KEY;
  if (!key) {
    throw new Error("❌ API Key no configurada. Añade VITE_CRYPTO_API_KEY en tu archivo .env");
  }
  return key;
}

export async function getCryptos() {
  // ⬇️ CAMBIO CLAVE: limit=20 en lugar de 100
  const apiKey = getApiKey();
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Diagnóstico
    console.log("🔑 API Key cargada:", import.meta.env.VITE_CRYPTO_API_KEY ? "SÍ" : "NO");
    console.log("🔗 URL llamada:", url);
    console.log("📡 Respuesta de CryptoCompare:", JSON.stringify(response.data, null, 2));

    if (response.data.Response === "Error") {
      throw new Error(`CryptoCompare Error: ${response.data.Message}`);
    }

    let Data = response.data?.Data;

    if (Data && Data.Coins && Array.isArray(Data.Coins)) {
      Data = Data.Coins;
    }

    if (!Array.isArray(Data)) {
      throw new Error(`'Data' no es un array. Tipo: ${typeof Data}`);
    }

    const filteredCryptos = Data.filter((item: any) => {
      const symbol = item?.CoinInfo?.Internal;
      const usdData = item?.RAW?.USD;

      if (!symbol || !usdData) return false;
      if (MEMECOIN_BLACKLIST.includes(symbol)) return false;
      if ((usdData.VOLUME24HOURTO || 0) < 20_000_000) return false;

      const result = CryptoCurrencyResponseSchema.safeParse(item);
      return result.success;
    });

    let finalList = filteredCryptos.slice(0, 30);

    if (finalList.length < 30) {
      const remaining = 30 - finalList.length;
      const backupCryptos = Data.filter((item: any) => {
        const symbol = item?.CoinInfo?.Internal;
        return symbol && !finalList.some(f => f.CoinInfo?.Internal === symbol);
      }).slice(0, remaining);

      finalList = [...finalList, ...backupCryptos];
    }

    return finalList;

  } catch (error) {
    console.error("❌ Error al obtener criptomonedas:", error);
    throw new Error(`No se pudieron cargar las criptomonedas: ${error.message}`);
  }
}

export async function fetchCurrentCryptoPrice(pair: Pair) {
  const apiKey = getApiKey();
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.cryptocurrency}&tsyms=${pair.currency}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const DISPLAY = response.data?.DISPLAY;

    if (!DISPLAY) {
      throw new Error("Respuesta inválida: DISPLAY no encontrado");
    }

    const priceData = DISPLAY[pair.cryptocurrency]?.[pair.currency];
    if (!priceData) {
      throw new Error(`Precio no disponible para ${pair.cryptocurrency}/${pair.currency}`);
    }

    const result = CryptoPriceSchema.safeParse(priceData);

    if (result.success) {
      return result.data;
    }

    throw new Error("No se pudo validar el precio.");
  } catch (error) {
    console.error("❌ Error al obtener precio:", error);
    throw new Error("No se pudo obtener el precio.");
  }
}

export async function fetchCryptoHistory(pair: Pair, limit = 24) {
  const apiKey = getApiKey();
  const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${pair.cryptocurrency}&tsym=${pair.currency}&limit=${limit}&api_key=${apiKey}`;

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
  } catch (error) {
    console.error("❌ Error al obtener histórico:", error);
    throw new Error("No se pudo obtener el histórico.");
  }
}