import { z } from 'zod';

export const CurrencySchema = z.object({
    code: z.string(),
    name: z.string()
});



export const CryptoCurrencyResponseSchema = z.object({
    CoinInfo: z.object({
        // Datos generales
        FullName: z.string(),
        Name: z.string(),
        ImageUrl: z.string(),
        AssetLaunchDate: z.string(), // Fecha de lanzamiento
        MaxSupply: z.number(),       // Oferta máxima
    }),
    //   RAW: z.object({
    //     USD: z.object({
    //       // Precios clave
    //       PRICE: z.number(),          
    //       OPEN24HOUR: z.number(),      
    //       LOW24HOUR: z.number(),      
    //       OPENHOUR: z.number(),        
    //     }),
    //   }),
});

export const CryptoCurrenciesResponseSchema = z.array(CryptoCurrencyResponseSchema);

export const PairSchema = z.object({
    currency: z.string(),
    cryptoCurrency: z.string()
});