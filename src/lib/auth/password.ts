import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Password hashing using Node.js built-in scrypt.
 *
 * No external dependencies needed (bcrypt requires native binaries).
 * Format: salt:hash (both hex-encoded).
 *
 * scrypt parameters:
 * - keyLength: 64 bytes
 * - cost (N): 16384
 * - blockSize (r): 8
 * - parallelization (p): 1
 */

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

/**
 * Hash a password with a random salt.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS).toString(
    "hex",
  );
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = scryptSync(
    password,
    salt,
    KEY_LENGTH,
    SCRYPT_OPTIONS,
  );

  return timingSafeEqual(hashBuffer, candidateBuffer);
}
