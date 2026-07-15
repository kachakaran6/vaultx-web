import type { EncryptedVaultSnapshot } from "../store/types";

const ITERATIONS = 150_000;

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
}

function bytesToBase64(bytes: Uint8Array): string {
  let output = "";
  for (const byte of bytes) {
    output += String.fromCharCode(byte);
  }
  return btoa(output);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveAesKey(
  password: string,
  salt: Uint8Array,
  usage: KeyUsage[]
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: toArrayBuffer(salt),
      iterations: ITERATIONS,
      hash: "SHA-256"
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    usage
  );
}

export async function hashPin(pin: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin));
  return Array.from(new Uint8Array(digest))
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return (await hashPin(pin)) === hash;
}

export async function encryptText(
  plainText: string,
  password: string
): Promise<Omit<EncryptedVaultSnapshot, "version" | "exportedAt" | "encrypted">> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(password, salt, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    encoder.encode(plainText)
  );

  return {
    algorithm: "AES-GCM",
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    payload: bytesToBase64(new Uint8Array(encrypted))
  };
}

export async function decryptText(payload: EncryptedVaultSnapshot, password: string): Promise<string> {
  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const cipherBytes = base64ToBytes(payload.payload);
  const key = await deriveAesKey(password, salt, ["decrypt"]);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(cipherBytes)
  );

  return new TextDecoder().decode(decrypted);
}

export function generateSecurePassword(length = 16): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = lowercase + uppercase + numbers + symbols;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = "";
  // Ensure at least one character from each set for strong security
  password += lowercase[array[0] % lowercase.length];
  password += uppercase[array[1] % uppercase.length];
  password += numbers[array[2] % numbers.length];
  password += symbols[array[3] % symbols.length];

  for (let i = 4; i < length; i++) {
    password += allChars[array[i] % allChars.length];
  }

  // Shuffle the password characters
  const passwordArray = password.split("");
  const shuffleArray = new Uint32Array(length);
  crypto.getRandomValues(shuffleArray);
  for (let i = length - 1; i > 0; i--) {
    const j = shuffleArray[i] % (i + 1);
    const temp = passwordArray[i];
    passwordArray[i] = passwordArray[j];
    passwordArray[j] = temp;
  }

  return passwordArray.join("");
}

const TRUSTED_DOMAINS = [
  "paypal.com",
  "google.com",
  "apple.com",
  "facebook.com",
  "amazon.com",
  "netflix.com",
  "microsoft.com",
  "github.com",
  "twitter.com",
  "instagram.com",
  "samast.pro"
];

export function detectConfusableDomain(inputUrl: string): string | null {
  try {
    const urlObj = new URL(inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`);
    const host = urlObj.hostname.toLowerCase().replace(/^www\./, "");
    
    if (TRUSTED_DOMAINS.includes(host)) {
      return null;
    }
    
    const normalize = (str: string) => {
      return str
        .replace(/[1i|]/g, "l")
        .replace(/0/g, "o")
        .replace(/rn/g, "m")
        .replace(/vv/g, "w");
    };
    
    const normalizedHost = normalize(host);
    
    for (const trusted of TRUSTED_DOMAINS) {
      const normalizedTrusted = normalize(trusted);
      if (normalizedHost === normalizedTrusted) {
        return trusted;
      }
    }
  } catch (e) {
    // ignore malformed URLs
  }
  return null;
}
