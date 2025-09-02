import { create } from "zustand";
import { devtools } from 'zustand/middleware';
import type { Cryptocurrency, CryptoPrice, Pair } from "./types";
import { getCryptos, fetchCurrentCryptoPrice } from "./services/CryptoService";

type CryptoStore = {
  isLoading: boolean;
  error: string | null;
  cryptocurrencies: Cryptocurrency[];
  result: CryptoPrice | null; // ✅ Cambiado: puede ser null al inicio
  fetchCryptos: () => Promise<void>;
  fetchData: (pair: Pair) => Promise<void>;
};

export const useCryptoStore = create<CryptoStore>()(
  devtools((set) => ({
    // Estado inicial
    isLoading: false,
    error: null,
    cryptocurrencies: [],
    result: null, // ✅ null en vez de {} → más seguro

    // Acción: cargar criptomonedas
    fetchCryptos: async () => {
      set({ isLoading: true, error: null }); // ✅ Indicamos carga
      try {
        const cryptocurrencies = await getCryptos();
        set({ 
          cryptocurrencies, 
          isLoading: false 
        });
      } catch (error) {
        console.error("Error en fetchCryptos:", error);
        set({ 
          error: "No se pudieron cargar las criptomonedas", 
          isLoading: false 
        });
      }
    },

    // Acción: cotizar par
    fetchData: async (pair: Pair) => {
      set({ isLoading: true, error: null });
      try {
        const result = await fetchCurrentCryptoPrice(pair);
        set({ 
          result, 
          isLoading: false 
        });
      } catch (error) {
        console.error("Error en fetchData:", error);
        set({ 
          error: "No se pudo obtener el precio", 
          isLoading: false 
        });
      }
    },
  }))
);