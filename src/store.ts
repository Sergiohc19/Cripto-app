/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CryptoCurrency, CryptoPrice, Pair } from "./types";
import { getCryptos, fetchCurrentCryptoPrice, fetchCryptoHistory } from "./services/CryptoService";

type CryptoStore = {
  pair: Pair | null;
  historyData: { time: number; close: number }[];
  isLoading: boolean;
  cryptoLoading: boolean;
  error: string | null;
  cryptocurrencies: CryptoCurrency[];
  result: CryptoPrice;
  hasQuoted: boolean;
  period: '24h' | '7d' | '30d';
  setHasQuoted: (value: boolean) => void;
  fetchCryptos: () => Promise<void>;
  fetchData: (pair: Pair, period?: '24h' | '7d' | '30d') => Promise<void>;
  setPeriod: (period: '24h' | '7d' | '30d') => void;
};

export const useCryptoStore = create<CryptoStore>()(
  devtools((set, get) => ({
    cryptocurrencies: [],
    result: {} as CryptoPrice,
    isLoading: false,
    cryptoLoading: false,
    error: null,
    hasQuoted: false,
    pair: null,
    historyData: [],
    period: '24h',

    setHasQuoted: (value) => set(() => ({ hasQuoted: value })),

    fetchCryptos: async () => {
      set({ cryptoLoading: true, error: null });
      try {
        const fetchedCryptos = await getCryptos();
        // Map or transform fetchedCryptos to match CryptoCurrency[]
        const cryptocurrencies: CryptoCurrency[] = fetchedCryptos
          .filter((c: any) => c.CoinInfo && c.CoinInfo.FullName && c.CoinInfo.Name)
          .map((c: any) => ({
            ...c,
            CoinInfo: {
              FullName: c.CoinInfo.FullName,
              Name: c.CoinInfo.Name,
              Internal: c.CoinInfo.Internal,
            },
          }));
        console.log("✅ Criptomonedas cargadas:", cryptocurrencies.length, "items");
        set({ cryptocurrencies, cryptoLoading: false });
      } catch (error) {
        const message = (error as Error).message || "Error al cargar criptomonedas";
        console.error("❌ Error en fetchCryptos:", message);
        set({ error: message, cryptoLoading: false });
      }
    },

    fetchData: async (pair, period = get().period) => {
      console.log("🔍 fetchData - par:", pair, "período:", period); // 👈 Debug
      set({ isLoading: true, error: null, historyData: [], result: {} as CryptoPrice }); // 👈 Reset

      try {
        const result = await fetchCurrentCryptoPrice(pair);
        
        let limit = 24;
        if (period === '7d') limit = 168;
        if (period === '30d') limit = 720;

        const historyData = await fetchCryptoHistory(pair, limit);

        set({
          result,
          pair,
          historyData,
          period,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const message = (error as Error).message || "Error fetching data";
        console.error("❌ Error en fetchData:", message);
        set({
          error: message,
          isLoading: false,
        });
      }
    },

    setPeriod: (period) => set({ period }),
  }))
);