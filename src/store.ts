import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CryptoCurrency, CryptoPrice, Pair } from "./types";
import { getCryptos, fetchCurrentCryptoPrice, fetchCryptoHistory } from "./services/CryptoService";

type CryptoStore = {
  pair: Pair | null;
  historyData: { time: number; close: number }[];
  isLoading: boolean;
  error: string | null;
  cryptocurrencies: CryptoCurrency[];
  result: CryptoPrice;
  hasQuoted: boolean;
  setHasQuoted: (value: boolean) => void;
  fetchCryptos: () => Promise<void>;
  fetchData: (pair: Pair) => Promise<void>;
};

export const useCryptoStore = create<CryptoStore>()(
  devtools((set) => ({
    cryptocurrencies: [],
    result: {} as CryptoPrice,
    isLoading: false,
    error: null,
    hasQuoted: false,
    pair: null,
    historyData: [],

    setHasQuoted: (value) => set(() => ({ hasQuoted: value })),

    fetchCryptos: async () => {
      try {
        const cryptocurrencies = await getCryptos();
        set(() => ({ cryptocurrencies }));
      } catch (error) {
        set({ error: (error as Error).message || "Error fetching cryptocurrencies" });
      }
    },

    fetchData: async (pair) => {
      set({ isLoading: true, error: null });
      try {
        const result = await fetchCurrentCryptoPrice(pair);
        const historyData = await fetchCryptoHistory(pair);

        set(() => ({
          result,
          pair,
          historyData,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          error: (error as Error).message || "Error fetching data",
          isLoading: false,
        });
      }
    },
  }))
);
