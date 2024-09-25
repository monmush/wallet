export function encrypt(text: string): string {
  return btoa(text);
}

export function decrypt(encryptedText: string): string {
  return atob(encryptedText);
}
