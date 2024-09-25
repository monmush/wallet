"use server";

import * as bip32 from "bip32";
import * as bip39 from "bip39";
import { networks, payments } from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

export async function generateSecretPhrase() {
  const mnemonic = bip39.generateMnemonic();
  const secretPhases = mnemonic.split(" ");
  const bip32Instance = bip32.BIP32Factory(ecc);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Instance.fromSeed(seed, networks.bitcoin);

  // Derive the Bitcoin wallet (BIP-44 path for Bitcoin: m/44'/0'/0'/0/0)
  const account = root.derivePath("m/44'/0'/0'/0/0");

  // Get the public key and Bitcoin address
  const { address } = payments.p2pkh({ pubkey: account.publicKey });

  return { mnemonic, secretPhases, address, account };
}
