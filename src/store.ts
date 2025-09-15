// store.ts
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
  period: '24h' | '7d' | '30d'; // <-- Nuevo
  setHasQuoted: (value: boolean) => void;
  fetchCryptos: () => Promise<void>;
  fetchData: (pair: Pair, period?: '24h' | '7d' | '30d') => Promise<void>; // <-- Modificado
  setPeriod: (period: '24h' | '7d' | '30d') => void; // <-- Nuevo
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
    period: '24h', // <-- Valor inicial

    setHasQuoted: (value) => set(() => ({ hasQuoted: value })),

    fetchCryptos: async () => {
      set({ cryptoLoading: true, error: null });
      try {
        const cryptocurrencies = await getCryptos();
        console.log("✅ Criptomonedas cargadas:", cryptocurrencies.length, "items");
        set(() => ({ cryptocurrencies, cryptoLoading: false }));
      } catch (error) {
        const message = (error as Error).message || "Error al cargar criptomonedas";
        console.error("❌ Error en fetchCryptos:", message);
        set({ error: message, cryptoLoading: false });
      }
    },

    fetchData: async (pair, period = get().period) => {
      set({ isLoading: true, error: null });
      try {
        const result = await fetchCurrentCryptoPrice(pair);
        
        // Determinar cuántos puntos pedir según el período
        let limit = 24; // default 24h
        if (period === '7d') limit = 168; // 7 días * 24h
        if (period === '30d') limit = 720; // 30 días * 24h

        const historyData = await fetchCryptoHistory(pair, limit);

        set({
          result,
          pair,
          historyData,
          period, // <-- Guardamos el período
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const message = (error as Error).message || "Error al obtener datos";
        console.error("❌ Error en fetchData:", message);
        set({
          error: message,
          isLoading: false,
        });
      }
    },

    setPeriod: (period) => set({ period }), // <-- Setter
  }))
);