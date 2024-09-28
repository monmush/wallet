"use client";

import { decrypt, encrypt } from "@/utils/encryption";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Wallet {
  address?: string;
  privateKey?: Uint8Array;
  publicKey?: Uint8Array;
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
