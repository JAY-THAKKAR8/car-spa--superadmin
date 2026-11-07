/**
 * Bridge between this app (camelCase, `id`, `success`) and the Carnmore API
 * (snake_case, `_id`, `status`, under /api). Keys only — values are never touched,
 * so enum values (SUV, IN_PROGRESS), ids-as-keys and date-keyed maps pass through as-is.
 */

type Json = unknown;

const SNAKE_KEY = /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/;
const CAMEL_KEY = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)+$/;

export const camelKey = (key: string): string => {
  if (key === '_id') return 'id';
  return SNAKE_KEY.test(key) ? key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase()) : key;
};

export const snakeKey = (key: string): string => (CAMEL_KEY.test(key) ? key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`) : key);

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype;

const mapKeys = (value: Json, fn: (k: string) => string): Json => {
  if (Array.isArray(value)) return value.map((v) => mapKeys(v, fn));
  if (!isPlainObject(value)) return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) out[fn(k)] = mapKeys(v, fn);
  return out;
};

export const toCamel = <T = Json>(value: Json): T => mapKeys(value, camelKey) as T;
export const toSnake = <T = Json>(value: Json): T => mapKeys(value, snakeKey) as T;

/** API envelope → the shape this app was written for: { success, message, data, errors[{path,message}] }. */
export const adaptBody = (body: unknown): unknown => {
  if (!isPlainObject(body) || !('status' in body) || typeof body.status !== 'boolean') return body;
  const errors = Array.isArray(body.errors)
    ? (body.errors as Array<{ field?: string; message: string }>).map((e) => ({ path: e.field, message: e.message }))
    : body.errors;
  return { success: body.status, message: body.message, data: toCamel(body.data), ...(errors !== undefined ? { errors } : {}) };
};

/** Query string keys to snake_case: "?serviceId=1&day=x" → "?service_id=1&day=x". */
export const snakeQuery = (url: string): string => {
  const at = url.indexOf('?');
  if (at < 0) return url;
  const params = new URLSearchParams(url.slice(at + 1));
  const out = new URLSearchParams();
  params.forEach((v, k) => out.append(snakeKey(k), v));
  return `${url.slice(0, at)}?${out.toString()}`;
};

export const snakeFormData = (form: FormData): FormData => {
  const out = new FormData();
  form.forEach((v, k) => out.append(snakeKey(k), v));
  return out;
};

/** fetch() for the public pages (booking, tracking): same envelope + key mapping as axios. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiFetch(base: string, path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; body: any }> {
  const body = init?.body && typeof init.body === 'string' ? JSON.stringify(toSnake(JSON.parse(init.body))) : init?.body;
  const res = await fetch(`${base}${snakeQuery(path)}`, { ...init, body });
  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body: adaptBody(json) };
}
