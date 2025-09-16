/* eslint-disable no-extra-boolean-cast */
/* eslint-disable prefer-const */
import axios from "axios";
import { CryptoCurrencyResponseSchema, CryptoPriceSchema } from "../schema/crypto-schema";
import type { Pair } from "../types";

// Lista de memecoins o tokens no deseados
const MEMECOIN_BLACKLIST = [
  "PEPE","BONK", "WIF", "FLOKI", "TURBO", "MOG", "ELON", "SAITO", "MYRO", "BOME",
  "NFT", "NOT", "PENGU", "MOTHER", "HIPPO", "ACT", "SATS", "ORDI", "REDO", "MAGA",
  "TRUMP", "COQ", "DADDY", "HARAMBE", "WOJAK", "SC", "SHI", "MEX", "AIDOGE", "BANANA",
  "TOSHI", "DOGINME", "SPX", "BRETT", "NEIRO", "GORK", "SNEK", "FWOG", "GOAT", "DADDY",
  "MUMU", "RATS", "POPCAT", "MEW", "CAT", "HOT", "ZEREBRO", "LADYS", "SILLY", "BANAN"
];

// Ranking “Top 20 real” que queremos asegurar
const TOP20_RANKING = [
  "BTC", "ETH", "USDT", "BNB", "SOL", "USDC", "XRP", "DOGE", "ADA", "SHIB",
  "LINK", "AVAX", "DOT", "MATIC", "LTC", "WBTC", "BCH", "ATOM", "XLM", "NEAR"
];

function getApiKey() {
  const key = import.meta.env.VITE_CRYPTO_API_KEY;
  if (!key) throw new Error("❌ API Key no configurada. Añade VITE_CRYPTO_API_KEY en tu archivo .env");
  return key;
}

// ✅ Interfaz corregida: todos los campos opcionales para evitar errores de TypeScript
interface CryptoCompareCoin {
  CoinInfo?: {
    Name?: string;
    Internal?: string;
    FullName?: string;
    [key: string]: unknown;
  };
  RAW?: {
    USD?: {
      VOLUME24HOURTO?: number;
      VOLUME24HOUR?: number;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

export async function getCryptos() {
  const apiKey = getApiKey();
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log("🔑 API Key cargada:", !!apiKey ? "SÍ" : "NO");
    console.log("🔗 URL llamada:", url);

    let coins: CryptoCompareCoin[] = response.data?.Data?.Coins ?? response.data?.Data ?? [];
    if (!Array.isArray(coins)) throw new Error("'Data' no es un array.");

    // Helpers
    const getSymbol = (item: CryptoCompareCoin) => (item?.CoinInfo?.Name || item?.CoinInfo?.Internal)?.toUpperCase() || '';
    const getVolume = (item: CryptoCompareCoin) => item?.RAW?.USD?.VOLUME24HOURTO ?? item?.RAW?.USD?.VOLUME24HOUR ?? 0;

    // Filtro inicial: volumen mínimo + blacklist + schema
    let filtered = coins.filter(c => {
      const sym = getSymbol(c);
      const vol = getVolume(c);
      if (!sym || vol < 15_000_000 || MEMECOIN_BLACKLIST.includes(sym)) return false;
      const result = CryptoCurrencyResponseSchema.safeParse(c);
      return result.success;
    });

    // ➤ Construir lista final basada en TOP20_RANKING
    const finalList: CryptoCompareCoin[] = [];

    for (const symbol of TOP20_RANKING) {
      const coin = filtered.find(c => getSymbol(c) === symbol);
      if (coin) finalList.push(coin);
    }

    // ➤ Rellenar hasta 20 con otras monedas válidas
    for (const coin of filtered) {
      if (finalList.length >= 20) break;
      if (!finalList.some(f => getSymbol(f) === getSymbol(coin))) {
        finalList.push(coin);
      }
    }

    console.log(`✅ Lista final contiene ${finalList.length} criptomonedas.`);
    console.log("📋 Criptos incluidas:", finalList.map(getSymbol));

    return finalList;

  } catch (error) {
    console.error("❌ Error al obtener criptomonedas:", error);
    if (error instanceof Error) throw new Error(`No se pudieron cargar las criptomonedas: ${error.message}`);
    else throw new Error("No se pudieron cargar las criptomonedas: error desconocido");
  }
}

// ================================
// Otras funciones — URLs CORREGIDAS (sin espacios)
// ================================

export async function fetchCurrentCryptoPrice(pair: Pair) {
  const apiKey = getApiKey();
  // ✅ URL corregida: SIN ESPACIOS
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.cryptocurrency}&tsyms=${pair.currency}&api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const priceData = response.data?.DISPLAY?.[pair.cryptocurrency]?.[pair.currency];
    if (!priceData) throw new Error(`Precio no disponible para ${pair.cryptocurrency}/${pair.currency}`);
    const result = CryptoPriceSchema.safeParse(priceData);
    if (result.success) return result.data;
    throw new Error("No se pudo validar el precio.");
  } catch (error) {
    console.error("❌ Error al obtener precio:", error);
    throw new Error("No se pudo obtener el precio.");
  }
}

export async function fetchCryptoHistory(pair: Pair, limit = 24) {
  const apiKey = getApiKey();
  // ✅ URL corregida: SIN ESPACIOS
  const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${pair.cryptocurrency}&tsym=${pair.currency}&limit=${limit}&api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const rawData = response.data?.Data?.Data || [];
    if (!Array.isArray(rawData)) throw new Error("Formato de datos histórico inválido");
    return rawData.map((p: { time: number; close: number }) => ({ time: p.time, close: p.close }));
  } catch (error) {
    console.error("❌ Error al obtener histórico:", error);
    throw new Error("No se pudo obtener el histórico.");
  }
}