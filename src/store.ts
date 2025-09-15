// store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CryptoCurrency, CryptoPrice, Pair } from "./types";
import { getCryptos, fetchCurrentCryptoPrice, fetchCryptoHistory } from "./services/CryptoService";

type CryptoStore = {
  pair: Pair | null;
  historyData: { time: number; close: number }[];
  isLoading: boolean;
  cryptoLoading: boolean; // <-- Nuevo: estado de carga para criptos
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
    cryptoLoading: false, // <-- Inicializado
    error: null,
    hasQuoted: false,
    pair: null,
    historyData: [],

    setHasQuoted: (value) => set(() => ({ hasQuoted: value })),

    fetchCryptos: async () => {
      set({ cryptoLoading: true, error: null }); // <-- Activamos loading
      try {
        const cryptocurrencies = await getCryptos();
        console.log("✅ Criptomonedas cargadas:", cryptocurrencies.length, "items");
        set(() => ({ cryptocurrencies, cryptoLoading: false }));
      } catch (error) {
        const message = (error as Error).message || "Error al cargar criptomonedas";
        console.error("❌ Error en fetchCryptos:", message);
        set({ error: message, cryptoLoading: false }); // <-- Mostramos error
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
        const message = (error as Error).message || "Error al obtener datos";
        console.error("❌ Error en fetchData:", message);
        set({
          error: message,
          isLoading: false,
        });
      }
    },
  }))
);