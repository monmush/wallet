"use client";

import { decrypt, encrypt } from "@/utils/encryption";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Wallet {
  address?: string;
  privateKey?: Uint8Array;
  publicKey?: Uint8Array;
  balance?: number;
}

export function useWallet() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const passcode = localStorage.getItem("passcode");

  if (!passcode) {
    // TODO: Add toast message before redirecting
    router.push("/passcode");
  }

  const { encrypted: encryptedPasscode } = JSON.parse(passcode!);

  useEffect(() => {
    const encryptedWallet = localStorage.getItem("wallet");
    if (encryptedWallet) {
      try {
        const decryptedWallet = decrypt(encryptedWallet, encryptedPasscode);
        const wallet = JSON.parse(decryptedWallet);
        setWallet(wallet);
      } catch (error) {
        console.error("Failed to decrypt wallet:", error);
      }
    }
  }, [encryptedPasscode]);

  useEffect(() => {
    async function fetchWalletData() {
      try {
        // TODO: Consider using a more reliable API for production
        const response = await fetch(
          `https://blockchain.info/q/addressbalance/${address}`
        );
        const balanceSatoshis = await response.text();
        const balanceBTC = parseInt(balanceSatoshis) / 100000000; // Convert satoshis to BTC

        setWallet((prev) => ({ ...prev, balance: balanceBTC }));
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWalletData();
  }, [wallet?.address]);

  const saveWallet = (newWallet: Wallet) => {
    const stringifiedWallet = JSON.stringify(newWallet);
    const encryptedWallet = encrypt(stringifiedWallet, encryptedPasscode);
    localStorage.setItem("wallet", encryptedWallet);
    setWallet(newWallet);
  };

  const clearWallet = () => {
    localStorage.removeItem("wallet");
    setWallet(null);
  };

  // if (!wallet) {
  //   // TODO: Add toast message before redirecting
  //   router.push("/secret-phrase-understanding");
  // }

  return {
    wallet,
    saveWallet,
    clearWallet,
  };
}
