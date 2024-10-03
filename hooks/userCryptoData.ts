"use client";

import { fetchCryptoData } from "@/app/actions";
import { useEffect, useState } from "react";

type CryptoData = {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
};

export function useCryptoData() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCryptoData() {
      try {
        setIsLoading(true);
        const data = await fetchCryptoData();
        setCryptoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    getCryptoData();
  }, []);

  return { cryptoData, isLoading, error };
}
