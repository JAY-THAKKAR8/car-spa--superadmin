/** 10-15 digits once punctuation/spaces/country-code symbols are stripped. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/** Matches the backend's subdomain rule: lowercase letters/digits/hyphens, no leading/trailing hyphen. */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(value.toLowerCase());
}
