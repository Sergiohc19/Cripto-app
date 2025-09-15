// crypto-schema.ts
import { z } from 'zod';

export const CurrencySchema = z.object({
    code: z.string(),
    name: z.string()
});

// 👇 Esquema corregido: ahora permite campos adicionales (RAW, DISPLAY, etc.)
export const CryptoCurrencyResponseSchema = z.object({
    CoinInfo: z.object({
        FullName: z.string(),
        Name: z.string(),
        Internal: z.string().optional(), // <-- Añadido por si lo usas
    }),
}).passthrough(); // 👈 ¡CLAVE! Permite campos adicionales sin fallar

export const CryptoCurrenciesResponseSchema = z.array(CryptoCurrencyResponseSchema);

export const PairSchema = z.object({
    currency: z.string(),
    cryptocurrency: z.string()
});

export const CryptoPriceSchema = z.object({
    IMAGEURL : z.string(),
    PRICE: z.string(),
    HIGHDAY: z.string(),
    LOWDAY: z.string(),
    HIGH24HOUR: z.string(),
    LASTUPDATE: z.string(),
    HIGHHOUR: z.string()
});