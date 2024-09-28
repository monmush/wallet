import { AES, enc, lib, PBKDF2 } from "crypto-js";

const KEY_SIZE = 256 / 32;
const ITERATIONS = 1000;
const SALT_LENGTH = 16;

export function generateSalt(): string {
  return lib.WordArray.random(SALT_LENGTH).toString();
}

// Strengthening passcode security:
// Directly using the passcode as the AES encryption key is weak and easily reversible.
// The deriveKey function uses PBKDF2 with a salt to create a stronger, more secure key,
// making decryption much harder for attackers.
export function deriveKey(secret: string, salt: string): string {
  return PBKDF2(secret, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
  }).toString();
}

export function encrypt(plaintext: string, secret?: string): string {
  const salt = generateSalt();
  const key = deriveKey(secret ?? plaintext, salt);
  const encrypted = AES.encrypt(plaintext, key).toString();
  return JSON.stringify({ salt, encrypted });
}

export function decrypt(encryptedData: string, secret: string): string {
  const { salt, encrypted } = JSON.parse(encryptedData);
  const key = deriveKey(secret, salt);
  const decrypted = AES.decrypt(encrypted, key);
  return decrypted.toString(enc.Utf8);
}
