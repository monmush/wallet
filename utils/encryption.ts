import { AES, enc, lib, PBKDF2 } from "crypto-js";

const SALT = "your-unique-salt-here"; // Replace with a unique, random string
const KEY_SIZE = 256 / 32;
const ITERATIONS = 1000;
const SALT_LENGTH = 16;

export function generateSalt(): string {
  return lib.WordArray.random(SALT_LENGTH).toString();
}

export function generateKey(passcode: string): string {
  return PBKDF2(passcode, SALT, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
  }).toString();
}

export function deriveKey(passcode: string, salt: string): string {
  return PBKDF2(passcode, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
  }).toString();
}

export function encrypt(passcode: string): string {
  const salt = generateSalt();
  const key = deriveKey(passcode, salt);
  const encrypted = AES.encrypt(passcode, key).toString();
  return JSON.stringify({ salt, encrypted });
}

export function decrypt(encryptedData: string, passcode: string): string {
  const { salt, encrypted } = JSON.parse(encryptedData);
  const key = deriveKey(passcode, salt);
  const decrypted = AES.decrypt(encrypted, key);
  return decrypted.toString(enc.Utf8);
}
