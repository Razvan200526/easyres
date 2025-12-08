import { color } from 'console-log-colors';
import PrettyError from 'pretty-error';

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mimeMatch = (arr[0] as string).match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  if (!arr[1]) {
    return;
  }
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
export const formatRelativeNumber = (num: number, precision = 1): string => {
  return new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: precision,
  }).format(num);
};

// random.ts

// URL-safe alphabet used by NanoID
const URL_SAFE_ALPHABET =
  '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Securely generate random bytes in TypeScript.
 * - Browser: crypto.getRandomValues
 * - Node (older versions): crypto.randomBytes
 */
function getSecureRandomBytes(size: number): Uint8Array {
  // Browser or Node 19+ where globalThis.crypto exists
  if (
    typeof globalThis.crypto !== 'undefined' &&
    'getRandomValues' in globalThis.crypto
  ) {
    const buf = new Uint8Array(size);
    globalThis.crypto.getRandomValues(buf);
    return buf;
  }

  // Node fallback for older versions
  try {
    const nodeCrypto: typeof import('crypto') = require('node:crypto');
    if (typeof nodeCrypto.randomBytes === 'function') {
      return new Uint8Array(nodeCrypto.randomBytes(size));
    }
  } catch {
    // ignore, will fall back below
  }

  // Non-secure fallback as a last resort (avoid in production)
  console.warn(
    '[random.nanoid] No secure RNG available; falling back to Math.random (NOT secure)',
  );
  const buf = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
}

/**
 * Random utilities.
 */
export const random = {
  /**
   * Generate a URL-safe NanoID-like string.
   * @param length Number of characters; default 21. Use 15 for your case.
   * @returns Random ID string of requested length.
   */
  nanoid(length = 21): string {
    if (!Number.isFinite(length) || length <= 0 || length > 1024) {
      throw new Error(
        'random.nanoid: length must be a positive number <= 1024',
      );
    }

    const alphabet = URL_SAFE_ALPHABET;
    // Bitmask covering the nearest power-of-two range >= alphabet.length
    const mask = (1 << Math.ceil(Math.log2(alphabet.length))) - 1;
    // Heuristic buffer size to reduce rejections and ensure we collect enough chars
    const step = Math.ceil((1.6 * mask * length) / alphabet.length);

    const idChars: string[] = [];
    while (idChars.length < length) {
      const bytes = getSecureRandomBytes(step);
      for (let i = 0; i < bytes.length && idChars.length < length; i++) {
        const index = (bytes[i] as any) & mask;
        // Accept only indices within alphabet length to avoid modulo bias
        if (index < alphabet.length) {
          idChars.push(alphabet[index] as string);
        }
      }
    }

    return idChars.join('');
  },
};

// Example:
// const id: string = random.nanoid(15);
// console.log(id, id.length); // -> e.g. "x3mAq2_-W0n9ZpL", 15
// timeAgo.ts

/**
 * Returns a compact relative string like "12m ago", "2h ago", "3d ago".
 * - Input can be Date, ISO string, or timestamp (ms).
 * - Uses "now" when within 30 seconds by default.
 * - Handles future dates (returns "in 5m", "in 2h", etc).
 */
export function formatDate(
  input: Date | string | number,
  options?: {
    now?: Date | number; // override current time, useful for SSR/tests
    nowThresholdSeconds?: number; // default 30
  },
): string {
  const nowInput = options?.now ?? Date.now();
  const now = nowInput instanceof Date ? nowInput.getTime() : Number(nowInput);

  const date =
    input instanceof Date
      ? input
      : typeof input === 'string'
        ? new Date(input)
        : new Date(input);

  const target = date.getTime();
  if (Number.isNaN(target)) return '';

  const diffMs = now - target; // positive => past
  const future = diffMs < 0;
  const absSec = Math.abs(diffMs) / 1000;

  const threshold = options?.nowThresholdSeconds ?? 30;
  if (absSec <= threshold) return 'now';

  // Unit boundaries (approximate):
  const MINUTE = 60;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY; // approximation
  const YEAR = 365 * DAY; // approximation

  let value: number;
  let unit: string;

  if (absSec < HOUR) {
    value = Math.floor(absSec / MINUTE);
    unit = 'm';
  } else if (absSec < DAY) {
    value = Math.floor(absSec / HOUR);
    unit = 'h';
  } else if (absSec < WEEK) {
    value = Math.floor(absSec / DAY);
    unit = 'd';
  } else if (absSec < MONTH) {
    value = Math.floor(absSec / WEEK);
    unit = 'w';
  } else if (absSec < YEAR) {
    value = Math.floor(absSec / MONTH);
    unit = 'mo';
  } else {
    value = Math.floor(absSec / YEAR);
    unit = 'y';
  }

  return future ? `in ${value}${unit}` : `${value}${unit} ago`;
}

/**
 * Examples:
 */
// console.log(timeAgo(new Date(Date.now() - 12 * 60 * 1000))); // "12m ago"
// console.log(timeAgo("2025-10-08T20:59:00+03:00")); // "1m ago" (depending on now)
// console.log(timeAgo(Date.now() + 2 * 60 * 60 * 1000)); // "in 2h"
// console.log(
//   timeAgo(Date.now() - 3 * 24 * 60 * 60 * 1000, { nowThresholdSeconds: 10 })
// ); // "3d ago"
// console.log(
//   timeAgo("invalid-date") // ""
// );

export const pe = new PrettyError();

pe.skipNodeFiles();
pe.skipPackage('bun', 'zod');

export function printEnvErrors(errors: any[]) {
  let message = `${color.redBright('✘ Missing Environment Variables')}\n\n`;

  errors.forEach((err) => {
    const variable = err.path[0];
    const cleaned = err.message.replace(/\s+/g, ' ');

    message += `${color.yellow('•')} ${color.white(variable)} ${color.gray('→')} ${color.red(cleaned)}\n`;
  });

  const e = new Error(message);

  console.error(pe.render(e));
}
