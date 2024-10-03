"use server";

import * as bip32 from "bip32";
import * as bip39 from "bip39";
import { networks, payments } from "bitcoinjs-lib";
import { cache } from "react";
import * as ecc from "tiny-secp256k1";

export type WalletInfo = {
  mnemonic: string;
  secretPhases: string[];
  address: string | undefined;
  privateKey: Uint8Array | undefined;
  publicKey: Uint8Array | undefined;
};

export async function generateSecretPhrase(): Promise<WalletInfo> {
  const mnemonic = bip39.generateMnemonic();
  const secretPhases = mnemonic.split(" ");
  const bip32Instance = bip32.BIP32Factory(ecc);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Instance.fromSeed(seed, networks.bitcoin);

  // Derive the Bitcoin wallet (BIP-44 path for Bitcoin: m/44'/0'/0'/0/0)
  const { publicKey, privateKey } = root.derivePath("m/44'/0'/0'/0/0");

  // Get the public key and Bitcoin address
  const { address } = payments.p2pkh({ pubkey: publicKey });

  return { mnemonic, secretPhases, address, privateKey, publicKey };
}

type CryptoData = {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
};

export const fetchCryptoData = cache(async (): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API_KEY!,
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from CoinMarketCap");
    }

    const data = await response.json();

    return data.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      price: coin.quote.USD.price,
      change: coin.quote.USD.percent_change_24h,
    }));
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
});

export const createWalletFromMnemonic = async (
  mnemonic: string
): Promise<WalletInfo> => {
  try {
    // Validate the mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic phrase");
    }

    const bip32Instance = bip32.BIP32Factory(ecc);

    // Generate seed from mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Create a root node from the seed
    const root = bip32Instance.fromSeed(seed);

    // Derive the first account's node (m/44'/0'/0'/0/0)
    const { privateKey, publicKey } = root.derivePath("m/44'/0'/0'/0/0");

    // Get the private key and address
    const { address } = payments.p2pkh({ pubkey: publicKey });

    return {
      mnemonic,
      secretPhases: mnemonic.split(" "),
      address,
      privateKey,
      publicKey,
    };
  } catch (error) {
    console.error("Error creating wallet from mnemonic:", error);
    throw new Error("Failed to create wallet from mnemonic");
  }
};
